import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../auth/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from 'cloudinary';
import mongoose from "mongoose";
import Post from "../models/postModel.js";
import KeyTokenService from "../services/keyToken.service.js";
import { createApiKey } from "../services/apikey.service.js";
import Notification from "../models/notificationModel.js";
import { notifyUser } from "../socket/socket.js";

export const getUserProfile = async (req, res) => {
	// We will fetch user profile either with username or userId
	// query is either username or userId
	const { query } = req.params;
	try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
};
export const signupUser = async (req, res) => {
	try {
		const { name, email, username, password } = req.body;
		const user = await User.findOne({ $or: [{ email }, { username }] })

		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			username,
			password: hashedPassword
		})
		

		if (newUser) {
			await newUser.save();

			const tokens = await generateTokenAndSetCookie(newUser._id, res);
			if (!tokens) {
				return res.status(500).json({ error: "Error generating tokens" });
			}

			const apiKey = await createApiKey(newUser._id);

			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
				tokens,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}

	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};


export const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}
		if (user.isFrozen) {
			user.isFrozen = false;
			await user.save();
		}
		const tokens = await generateTokenAndSetCookie(user._id, res);
		if (!tokens) {
			return res.status(500).json({ error: "Error generating tokens" });
		}

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			bio: user.bio,
			profilePic: user.profilePic,
			tokens
		});

	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in loginUser: ", error.message);
	}
};

export const logoutUser = async(req, res) => {
	try {
		const userId = req.headers['x-client-id']
		const delKey =  await KeyTokenService.deleteKeyByUserId(userId)
		res.cookie("accessToken", "", { maxAge: 1 });
		res.cookie("refreshToken", "", { maxAge: 1 });
		res.status(200).json({ message: "User logged out successfully" })
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in logoutUser: ", error.message);
	}
}

export const followUnFollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);
		if (isFollowing) {
			//Unfollow user
			//Modify current user following, modify followers of userToModify
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			res.status(200).json({ message: "User unfollowed successfully" });

		} else {
			// Follow user
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
			// Send notification to the user
			const newNotification = new Notification({
				type: "follow",
				from: req.user._id,
				to: userToModify._id,
			});

			await newNotification.save();

			notifyUser(userToModify._id, newNotification);

			res.status(200).json({ message: "User followed successfully" });

		}

	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in followUnFollowUser: ", error.message);
	}

}

export const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();
		// Find all posts that this user replied and update username and userProfilePic fields

		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				}
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		)
        
		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
		// exclude the current user from suggested users array and exclude users 
		// that current user is already following
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following")

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId }
				}
			}, {
				$sample: { size: 10 }
			}

		])
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id))
		const suggestedUsers = filteredUsers.slice(0, 4)
		suggestedUsers.forEach((user) => user.password = null)

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export const freezeAccount = async (req, res) => {
	try {
		const user = await User.findById(req.user._id)
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}
		user.isFrozen = true;
		await user.save();
		res.status(200).json({ success: true });

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}