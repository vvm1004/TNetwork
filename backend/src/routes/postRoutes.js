import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToPost } from "../controllers/postController.js";
import { apiKey, permisson } from '../auth/checkAuth.js';
import checkTokenExpired from "../middlewares/checkTokenExprired.js";

const router = express.Router();
router.get("/feed", checkTokenExpired, protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);

//check apikey
router.use(apiKey)

//check permission
router.use(permisson('0000'))

router.post("/create", checkTokenExpired, protectRoute, createPost);
router.delete("/:id", checkTokenExpired, protectRoute, deletePost);
router.put("/like/:id", checkTokenExpired, protectRoute, likeUnlikePost);
router.put("/reply/:id", checkTokenExpired, protectRoute, replyToPost);




export default router;