import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToPost } from "../controllers/postController.js";
import { apiKey, permisson } from '../auth/checkAuth.js';

const router = express.Router();

//check apikey
router.use(apiKey)

//check permission
router.use(permisson('0000'))

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);




export default router;