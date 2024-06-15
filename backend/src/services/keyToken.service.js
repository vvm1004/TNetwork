import mongoose from "mongoose";
import keyTokenModel from "../models/keyTokenModel.js";


class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
        try {
            // const publicKeyString = publicKey.toString()
            const filter = { user: userId }, updates = {
                publicKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, updates, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error;
        }
    }
    
    static findByUserId = async( userId ) => {
        return await keyTokenModel.findOne({user: new mongoose.Types.ObjectId(userId)})
    }
    static removeKeyById = async(id) => {
        return await keyTokenModel.deleteOne({ _id: id })
    }

    static deleteKeyByUserId = async(userId) => {
        return await keyTokenModel.deleteOne({user: userId})
    }
}

export default KeyTokenService;
