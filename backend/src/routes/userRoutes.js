import express from "express"
import { followUnFollowUser, freezeAccount, getSuggestedUsers, getUserProfile, loginUser, logoutUser, signupUser, updateUser } from "../controllers/userController.js"
import protectRoute from "../middlewares/protectRoute.js";
import { apiKey, permisson } from '../auth/checkAuth.js';
import checkTokenExpired from "../middlewares/checkTokenExprired.js";

const router = express.Router()

router.post("/signup", signupUser);
router.post("/login", loginUser);

router.get("/profile/:query", getUserProfile);
router.get("/suggested", checkTokenExpired, protectRoute, getSuggestedUsers);
router.post("/logout", logoutUser);

//check apikey
router.use(apiKey)

//check permissionG
router.use(permisson('0000'))

router.post("/follow/:id", checkTokenExpired, protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
router.put("/update/:id", checkTokenExpired, protectRoute, updateUser);
router.put("/freeze", checkTokenExpired, protectRoute, freezeAccount);



export default router