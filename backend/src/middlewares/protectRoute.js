import User from '../models/userModel.js'
import jwt from "jsonwebtoken";
import KeyTokenService from '../services/keyToken.service.js';

const HEADER = {
    // API_KEY : 'x-api-key',
    CLIENT_ID: 'x-client-id',
}

const protectRoute = async (req, res, next) => {
    try {
        const userId = req.headers[HEADER.CLIENT_ID]
        if (!userId) return res.status(401).json({ message: 'Invalid Request' });

        const keyStore = await KeyTokenService.findByUserId(userId)

        if (!keyStore) return res.status(404).json({ message: 'Not found UserId in keyStore' });
        
        const accessToken = req.cookies.accessToken;
        if (!accessToken) return res.status(401).json({ message: "Unauthorized" });
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

        let decoded = jwt.verify(accessToken, keyStore.publicKey)
        if (userId !== decoded.userId) res.status(401).json({ message: "Invalid UserId" });

        decoded = jwt.verify(refreshToken, keyStore.publicKey)
        if (userId !== decoded.userId) res.status(401).json({ message: "Invalid UserId" });
 
        const user = await User.findById(decoded.userId).select("-password")

        req.user = user;
        req.userId = decoded.userId
        req.keyStore = keyStore

        
        next();

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in authentication: ", error.message);
        
    }
}

export default protectRoute