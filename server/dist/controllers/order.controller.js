"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.save = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const save = async (req, res) => {
    const { date, categorie, id, prixClient, prixAchat, commentaire } = req.body;
    try {
        const order = await order_model_1.default.create({ date, categorie, id, prixClient, prixAchat, commentaire });
        res.status(201).json({
            _id: order._id,
        });
    }
    catch (error) {
        console.log({ date, categorie, id, prixClient, prixAchat, commentaire });
        res.status(500).json({ message: 'Server error' });
    }
};
exports.save = save;
const getAll = async (_req, res) => {
    console.log('get all orders called');
    try {
        const orders = await order_model_1.default.find();
        res.status(200).json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAll = getAll;
