"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.logout = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const generateToken_1 = require("../utils/generateToken");
const register = async (req, res) => {
    console.log('signin called');
    const { login, password } = req.body;
    try {
        const userExists = await user_model_1.default.findOne({ login });
        console.log('1');
        if (userExists)
            return res.status(400).json({ message: 'User already exists' });
        const user = await user_model_1.default.create({ login, password });
        console.log('2');
        res.status(201).json({
            _id: user._id,
            login: user.login,
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
            _id: user._id,
            login: user.login,
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
    res.json({ user: req.user });
};
exports.check = check;
