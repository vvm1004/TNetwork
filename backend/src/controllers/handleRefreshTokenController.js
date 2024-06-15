import { CommandInteractionOptionResolver } from "discord.js";
import generateTokenAndSetCookie from "../auth/generateTokenAndSetCookie.js";
import User from "../models/userModel.js";
import KeyTokenService from "../services/keyToken.service.js";
import jwt from 'jsonwebtoken'
const HEADER = {
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'x-rtoken-id'
}

export const handleRefreshToken = async (req, res) => {


    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const userId = req.headers[HEADER.CLIENT_ID]
            if (!userId) return res.status(401).json({ message: 'Invalid Request' });

            const keyStore = await KeyTokenService.findByUserId(userId)
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            if (keyStore.refreshTokenUsed.includes(refreshToken)) {
                await KeyTokenService.deleteKeyByUserId(userId)
                return res.status(403).json({ error: 'Something wrong happened!! Please relogin' });
            }
            
            const decodeUser = jwt.verify(refreshToken, keyStore.publicKey);
          
            if (userId !== decodeUser.userId) return res.status(401).json({ message: "Invalid UserId" });
            if (keyStore.refreshToken !== refreshToken) return res.status(401).json({ error: 'Users not registered' });

          
            const tokens = await generateTokenAndSetCookie(userId, res)
            const user = await User.findById(userId).select("_id name email username bio profilePic");

            await keyStore.updateOne({
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokenUsed: refreshToken //da duoc su dung de lay token moi
                }
            })


            return res.json({
               ...user._doc,
                tokens
            });
        } catch (error) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
    }else{
        return res.status(401).json({ message: 'Invalid Request' });
    }



}