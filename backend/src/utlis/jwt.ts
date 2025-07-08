// Load environment variables
import '../config/env'; // This ensures dotenv is loaded before accessing process.env

import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

interface TokenPayload {
  id: string;
  email: string;
}

export const generateToken = (user: IUser): string => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '604800', 10); // 7 days

  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
