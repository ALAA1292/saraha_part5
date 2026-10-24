import mongoose from 'mongoose';
import envConfig from '../../config/config.service.js';

const connectDB = async () => {
  try {
  await mongoose.connect(envConfig.database.uri);
      console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // process.exit(1);
  }
};

export default connectDB;