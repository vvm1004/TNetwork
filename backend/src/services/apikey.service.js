'use strict';

import mongoose from 'mongoose';
import apikeyModel from '../models/apikeyModel.js';
import crypto from 'crypto';
import fs from 'fs';

const createApiKey = async (userId) => {
    try {
        // Tạo một API key mới
        const newKey = await apikeyModel.create({ user: userId, key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] });
        console.log('API key đã được tạo:', newKey);

        // Cập nhật hoặc thêm biến mới vào file .env
        try {
            let envData = fs.readFileSync('.env', 'utf8');
            let envLines = envData.split('\n');
            let newEnvLine = `API_KEY_ID=${newKey._id}`;

            let updatedEnv = false;
            for (let i = 0; i < envLines.length; i++) {
                if (envLines[i].startsWith('API_KEY_ID=')) {
                    envLines[i] = newEnvLine;
                    updatedEnv = true;
                    break;
                }
            }

            if (!updatedEnv) {
                envLines.push(newEnvLine);
            }

            fs.writeFileSync('.env', envLines.join('\n'), 'utf8');

            console.log('API key ID đã được cập nhật vào file .env');
        } catch (error) {
            console.error('Lỗi khi cập nhật file .env:', error.message);
            throw error;
        }

        return newKey;
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
