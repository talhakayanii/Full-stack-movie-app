import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utlis/jwt';
import { User } from '../models/User';
import { sendResponse } from '../utlis/responseHelper';  // Import your response helper
import logger from '../config/logger';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      logger.warn('Access token missing');  // Log a warning if token is missing
      sendResponse(res, { success: false, message: 'Access token required' });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      logger.warn('Invalid token used by a user');  // Log a warning for invalid token
      sendResponse(res, { success: false, message: 'Invalid token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Token verification failed', { error });  // Log the error
    sendResponse(res, { success: false, message: 'Invalid or expired token', errors: error });
  }
};
