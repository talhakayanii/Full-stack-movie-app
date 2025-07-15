import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utlis/jwt';
import { authenticateToken } from '../middleware/auth';
import { sendResponse } from '../utlis/responseHelper';  // Importing the response helper

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendResponse(res, { success: false, message: 'User already exists with this email' });
      return;
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user);

    sendResponse(res, {
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      sendResponse(res, { success: false, message: messages.join(', ') });
    } else {
      sendResponse(res, { success: false, message: 'Server error' });
    }
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      sendResponse(res, { success: false, message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendResponse(res, { success: false, message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user);

    sendResponse(res, {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    sendResponse(res, { success: false, message: 'Server error' });
  }
});

// Get user profile (protected route)
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    sendResponse(res, {
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    sendResponse(res, { success: false, message: 'Server error' });
  }
});

export default router;
