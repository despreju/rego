import { Request, Response } from 'express';
import User from '../models/user.model';
import { generateToken } from '../utils/generateToken';
import Site from '../models/site.model';

interface AuthRequest extends Request {
  user?: any;
}

export const register = async (req: Request, res: Response) => {
  const { login, password, name, firstname, email, siteId } = req.body;
  try {
    const userExists = await User.findOne({ login });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ login, password, name, firstname, email, sitesId: [siteId] }) as import('../models/user.model').IUser;

    res.status(201).json({
      user: user,
      token: generateToken(String(user._id))
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log('login called',);
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ login }) as import('../models/user.model').IUser;
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      user,
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
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  const id = req.params.id ?? req.user?._id;
  if (!id) return res.status(400).json({ message: 'Missing user id' });

  try {
    const user = await User.findById(id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const siteIdRaw = String(_req.body?.siteId ?? _req.query?.siteId ?? '').trim();
    const query: any = {};

    if (siteIdRaw) {
      // valider le format ObjectId (24 hex chars)
      if (!/^[0-9a-fA-F]{24}$/.test(siteIdRaw)) {
        return res.status(400).json({ message: 'Invalid siteId' });
      }
      // users whose sitesId array contains the given siteId
      query.sitesId = siteIdRaw;
    }

    const users = await User.find(query)
      .select('-password -__v')
      .populate({ path: 'sitesId', select: 'name _id' })
      .lean();

    return res.status(200).json({ users });
  } catch (error) {
    console.error('getAllUsers error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const id = req.params.id ?? req.user?._id ?? req.user?.id;
  if (!id) return res.status(400).json({ message: 'Missing user id' });

  // authorization: only the user themself or admin can update
  if (req.user && String(req.user.id ?? req.user._id) !== String(id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { login, firstname, name, password, role, ...rest } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // if changing login, ensure uniqueness
    if (login && String(login) !== String(user.login)) {
      const exists = await User.findOne({ login });
      if (exists) return res.status(400).json({ message: 'Login already in use' });
      user.login = login;
    }

    if (firstname !== undefined) user.firstname = firstname;
    if (name !== undefined) user.name = name;

    // update password (will trigger model pre-save hash if implemented)
    if (password) user.password = password;

    // apply any other non-sensitive fields passed intentionally
    for (const [k, v] of Object.entries(rest)) {
      if (['password', 'login', '_id', 'id', '__v'].includes(k)) continue;
      (user as any)[k] = v;
    }

    await user.save();

    const safeUser = await User.findById(user._id).select('-password -__v');
    return res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('updateUser error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};