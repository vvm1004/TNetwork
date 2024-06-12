import express from "express"
import { followUnFollowUser, freezeAccount, getSuggestedUsers, getUserProfile, loginUser, logoutUser, signupUser, updateUser } from "../controllers/userController.js"
import protectRoute from "../middlewares/protectRoute.js";
import { apiKey, permisson } from '../auth/checkAuth.js';

const router = express.Router()

router.post("/signup", signupUser);
router.post("/login", loginUser);

//check apikey
router.use(apiKey)

//check permission
router.use(permisson('0000'))

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/logout", protectRoute, logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeAccount);





export default router