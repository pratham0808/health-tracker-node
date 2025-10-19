import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '365d'; // 1 year

export class AuthService {
  async register(firstname: string, lastname: string, email: string, password: string): Promise<{ user: { id: string; firstname: string; lastname: string; email: string }; token: string }> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = new User({
      firstname,
      lastname,
      email,
      password
    });

    await user.save();

    const token = this.generateToken((user._id as mongoose.Types.ObjectId).toString());

    return {
      user: {
        id: (user._id as mongoose.Types.ObjectId).toString(),
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      },
      token
    };
  }

  async login(email: string, password: string): Promise<{ user: { id: string; firstname: string; lastname: string; email: string }; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken((user._id as mongoose.Types.ObjectId).toString());

    return {
      user: {
        id: (user._id as mongoose.Types.ObjectId).toString(),
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      },
      token
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

