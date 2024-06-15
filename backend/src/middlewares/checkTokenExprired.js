import jwt from "jsonwebtoken";
import KeyTokenService from "../services/keyToken.service.js";
const HEADER = {
    // API_KEY : 'x-api-key',
    CLIENT_ID: 'x-client-id',
}

const checkTokenExpired = async (req, res, next) => {
    try {

        if (req.headers['x-accesstoken']) {
            const userId = req.headers[HEADER.CLIENT_ID]
            if (!userId) return res.status(401).json({ message: 'Invalid Request' });
            const keyStore = await KeyTokenService.findByUserId(userId)
            const accessToken = req.headers['x-accesstoken']   
            let decoded = jwt.verify(accessToken, keyStore.publicKey)
            next();
        }else{
            return res.status(401).json({ message: 'Invalid Request' })
        }
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(200).json({
                code: 401,
                msg: error.message
            })
        }
        res.status(500).json({ error: error.message });

    }
}

export default checkTokenExpired