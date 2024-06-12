'use strict';
import { findById } from '../services/apikey.service.js';
import dotenv from 'dotenv';

dotenv.config();
const apiKey = async (req, res, next) => {
    try {
        const apiKeyId = process.env.API_KEY_ID;
        if (!apiKeyId) {
            return res.status(403).json({ message: 'API key not found' });
        }

        // Kiểm tra objKey
        const objKey = await findById(apiKeyId);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            });
        }

        req.objKey = objKey;

        return next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const permisson = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permission denied'
            });
        }

        // console.log('permissions::', req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'permission denied'
            });
        }

        return next();
    };
};

export { apiKey, permisson };
