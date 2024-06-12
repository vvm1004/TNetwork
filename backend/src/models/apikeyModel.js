import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'apikey'
const COLLECTION_NAME = 'apikeys'

const apiKeySchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true
        },

        status: {
            type: Boolean,
            default: true
        },
        permissions: {
            type: [String],
            required: true,
            enum: ['0000', '1111', '2222']
        },

    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

export default model(DOCUMENT_NAME, apiKeySchema);
