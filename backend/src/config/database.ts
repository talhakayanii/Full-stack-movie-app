import mongoose from 'mongoose';



import logger from './logger'; // Importing winston logger

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);  // Replaced console.log with winston
  } catch (error) {
    logger.error('Database connection error:', error);  // Replaced console.error with winston
    process.exit(1);
  }
};
