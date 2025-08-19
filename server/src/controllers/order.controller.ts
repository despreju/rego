import { Request, Response } from 'express';
import Order from '../models/order.model';

export const save = async (req: Request, res: Response) => {
  const { date, categorie, id, prixClient, prixAchat, commentaire } = req.body;
  try {
    const order = await Order.create({ date, categorie, id, prixClient, prixAchat, commentaire }) as import('../models/order.model').IOrder;
    res.status(201).json({
      _id: order._id,
    });
  } catch (error) {
    console.log({ date, categorie, id, prixClient, prixAchat, commentaire });
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  console.log('get all orders called');
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};