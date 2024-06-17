import express from 'express';
import userRoutes from './userRoutes.js'
import postRoutes from './postRoutes.js'
import messageRoutes from './messageRoutes.js'
import notificationRoutes from './notificationRoutes.js'

import { handleRefreshToken } from '../controllers/handleRefreshTokenController.js';
// import { pushToLogDiscord } from '../middlewares/dicordLog.js';

const router = express.Router();

//add log to discord
// router.use(pushToLogDiscord)



router.use("/users", userRoutes)
router.use("/posts", postRoutes);
router.use("/messages", messageRoutes );
router.use("/notifications", notificationRoutes );

router.post("/handleRefreshToken", handleRefreshToken );


export default router;