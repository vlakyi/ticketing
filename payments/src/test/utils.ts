import mongoose from 'mongoose';

export const generateMongooseObjID = () => {
  return new mongoose.Types.ObjectId().toHexString();
};