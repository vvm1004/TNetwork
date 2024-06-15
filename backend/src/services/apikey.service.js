'use strict';

import mongoose from 'mongoose';
import apikeyModel from '../models/apikeyModel.js';
import crypto from 'crypto';
import fs from 'fs';

const createApiKey = async (userId) => {
    try {
        // Kiểm tra xem đã có API_KEY_ID trong file .env chưa
        let apiKeyId;
        try {
            const envData = fs.readFileSync('.env', 'utf8');
            const envLines = envData.split('\n');
            for (let i = 0; i < envLines.length; i++) {
                if (envLines[i].startsWith('API_KEY_ID=')) {
                    apiKeyId = envLines[i].split('=')[1];
                    break;
                }
            }
        } catch (error) {
            console.error('Lỗi khi đọc file .env:', error.message);
            throw error;
        }

        if (!apiKeyId) {
            // Tạo một API key mới
            const newKey = await apikeyModel.create({ user: userId, key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] });
            console.log('API key đã được tạo:', newKey);

            // Cập nhật file .env
            try {
                const newEnvLine = `API_KEY_ID=${newKey._id}`;
                fs.appendFileSync('.env', newEnvLine, 'utf8');
                console.log('API key ID đã được thêm vào file .env');
            } catch (error) {
                console.error('Lỗi khi cập nhật file .env:', error.message);
                throw error;
            }

            return newKey;
        } else {
            console.log('Đã có API key ID trong file .env:', apiKeyId);
            return null; // Trả về null để biểu thị rằng không cần tạo API key mới
        }
    } catch (error) {
        console.error('Lỗi khi tạo API key:', error.message);
        throw error;
    }
};


const findById = async (apiKeyId) => {
    try {
        const objKey = await apikeyModel.findById(apiKeyId);
        return objKey;
    } catch (error) {
        throw new Error(`Error finding key by API_KEY_ID: ${error.message}`);
    }
};
export { createApiKey, findById };
