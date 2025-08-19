import { Request, Response } from 'express';
import User from '../models/user.model';
import { generateToken } from '../utils/generateToken';

interface AuthRequest extends Request {
  user?: any;
}

export const register = async (req: Request, res: Response) => {
  console.log('signin called');
  const { login, password } = req.body;
  try {
    const userExists = await User.findOne({ login });
    console.log('1');
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ login, password }) as import('../models/user.model').IUser;
    console.log('2');
    res.status(201).json({
      _id: user._id,
      login: user.login,
      token: generateToken((user._id as string).toString())
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log('login called', );
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ login }) as import('../models/user.model').IUser;
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      _id: user._id,
      login: user.login,
      token: generateToken((user._id as string).toString())
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  console.log('logout called');
  res.status(200).json({ message: 'Logged out' });
};

export const check = async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user })
};