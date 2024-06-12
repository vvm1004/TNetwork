import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getMessages, sendMessage, getConversations } from "../controllers/messageController.js";
import { apiKey, permisson } from '../auth/checkAuth.js';

const router = express.Router();
//check apikey
router.use(apiKey)

//check permission
router.use(permisson('0000'))

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);


export default router;