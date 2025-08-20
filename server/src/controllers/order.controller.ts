import { Request, Response } from 'express';
import Order from '../models/order.model';

export const save = async (req: Request, res: Response) => {
  const { date, categorie, id, prixClient, prixAchat, commentaire } = req.body;
  try {
    if (id < 1) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
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

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Missing id parameter' });
  }

  try {
    let deleted = null;

    // Si id ressemble à un ObjectId, on essaye findByIdAndDelete
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      deleted = await Order.findByIdAndDelete(id);
    }

    // Si pas trouvé par _id, on essaye par champ numérique `id`
    if (!deleted) {
      const numericId = Number(id);
      if (!Number.isNaN(numericId)) {
        deleted = await Order.findOneAndDelete({ id: numericId });
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  const { id, date, categorie, prixClient, prixAchat, commentaire } = req.body
  if (!id) return res.status(400).json({ message: 'Missing id parameter' })

  try {
    // Récupère la commande soit par _id Mongo, soit par champ numérique `id`
    let order = null
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      order = await Order.findById(id)
    }
    if (!order) {
      const numericId = Number(id)
      if (!Number.isNaN(numericId)) {
        order = await Order.findOne({ id: numericId })
      }
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Applique les champs modifiables
    if (date !== undefined) order.date = date
    if (categorie !== undefined) order.categorie = categorie
    if (prixClient !== undefined) order.prixClient = Math.abs(Number(prixClient ?? 0))
    if (prixAchat !== undefined) order.prixAchat = Math.abs(Number(prixAchat ?? 0))
    if (commentaire !== undefined) order.commentaire = commentaire

    const saved = await order.save()
    return res.status(200).json(saved)
  } catch (error) {
    console.error('Error updating order:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
// ...existing