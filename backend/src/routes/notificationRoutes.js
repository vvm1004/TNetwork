import express from "express";
import { deleteNotifications, getNotifications, getUnreadCount } from "../controllers/notificationController.js";
import protectRoute from "../middlewares/protectRoute.js";
import checkTokenExpired from "../middlewares/checkTokenExprired.js";

const router = express.Router();

router.get("/",checkTokenExpired, protectRoute, getNotifications);
router.get("/unreadCount",checkTokenExpired, protectRoute, getUnreadCount);
router.delete("/",checkTokenExpired, protectRoute, deleteNotifications);

export default router;