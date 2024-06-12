import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'key';
const COLLECTION_NAME = 'keys';

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    publicKey: {
      type: String,
      required: true
    },
    refreshTokenUsed: {
      type: Array,
      default: []   //nhung RT da duoc su dung
    },
    refreshToken: { type: String, required: true }
  },
  { 
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

export default model(DOCUMENT_NAME, keyTokenSchema);
