"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getAllUsers = exports.getUser = exports.check = exports.logout = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const generateToken_1 = require("../utils/generateToken");
const register = async (req, res) => {
    console.log('signin called');
    const { login, password, name, firstname, email } = req.body;
    try {
        const userExists = await user_model_1.default.findOne({ login });
        console.log('1');
        if (userExists)
            return res.status(400).json({ message: 'User already exists' });
        const user = await user_model_1.default.create({ login, password, name, firstname, email });
        console.log('2');
        res.status(201).json({
            _id: user._id,
            login: user.login,
            name: user.name,
            firstname: user.firstname,
            email: user.email,
            token: (0, generateToken_1.generateToken)(user._id.toString())
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    console.log('login called');
    const { login, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ login });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: 'Invalid credentials' });
        res.status(200).json({
            user,
            token: (0, generateToken_1.generateToken)(user._id.toString())
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const logout = async (req, res) => {
    console.log('logout called');
    res.status(200).json({ message: 'Logged out' });
};
exports.logout = logout;
const check = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.user.id).select('-password -__v');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.check = check;
const getUser = async (req, res) => {
    const id = req.params.id ?? req.user?._id;
    if (!id)
        return res.status(400).json({ message: 'Missing user id' });
    try {
        const user = await user_model_1.default.findById(id).select('-password -__v');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getUser = getUser;
const getAllUsers = async (_req, res) => {
    try {
        // récupère tous les users sans champs sensibles
        const users = await user_model_1.default.find().select('-password -__v').lean();
        return res.status(200).json({ users });
    }
    catch (error) {
        console.error('getAllUsers error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllUsers = getAllUsers;
const updateUser = async (req, res) => {
    const id = req.params.id ?? req.user?._id ?? req.user?.id;
    if (!id)
        return res.status(400).json({ message: 'Missing user id' });
    // authorization: only the user themself or admin can update
    if (req.user && String(req.user.id ?? req.user._id) !== String(id) && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const { login, firstname, name, password, role, ...rest } = req.body;
    try {
        const user = await user_model_1.default.findById(id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // if changing login, ensure uniqueness
        if (login && String(login) !== String(user.login)) {
            const exists = await user_model_1.default.findOne({ login });
            if (exists)
                return res.status(400).json({ message: 'Login already in use' });
            user.login = login;
        }
        if (firstname !== undefined)
            user.firstname = firstname;
        if (name !== undefined)
            user.name = name;
        // update password (will trigger model pre-save hash if implemented)
        if (password)
            user.password = password;
        // apply any other non-sensitive fields passed intentionally
        for (const [k, v] of Object.entries(rest)) {
            if (['password', 'login', '_id', 'id', '__v'].includes(k))
                continue;
            user[k] = v;
        }
        await user.save();
        const safeUser = await user_model_1.default.findById(user._id).select('-password -__v');
        return res.status(200).json({ user: safeUser });
    }
    catch (error) {
        console.error('updateUser error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.updateUser = updateUser;
