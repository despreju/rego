import { Request, Response } from 'express';
import Order from '../models/order.model';
import User from '../models/user.model';

export const save = async (req: Request, res: Response) => {
  const { date, categorie, orderId, prixClient, prixAchat, commentaires, watch, history, user_id } = req.body;
  try {
    const order = await Order.create({
      date,
      categorie,
      orderId,
      prixClient,
      prixAchat,
      commentaires: commentaires !== '' ? [{ date: new Date(), commentaire: commentaires, username: user_id }] : [],
      watch,
      history: [{ date: new Date(), action: history, user_id: user_id }]
    }) as import('../models/order.model').IOrder;
    res.status(201).json({
      id: order.id,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  console.log('get all orders called');
  try {
    // récupère les commandes en plain objects pour les transformer facilement
    const orders = await Order.find().lean();

    // collecter tous les user_id présents dans history et commentaires
    const userIdSet = new Set<string>();
    for (const o of orders) {
      if (Array.isArray(o.history)) {
        for (const h of o.history) {
          if (h?.user_id !== undefined && h?.user_id !== null) userIdSet.add(String(h.user_id));
        }
      }
      if (Array.isArray(o.commentaires)) {
        for (const c of o.commentaires) {
          if (c?.user_id !== undefined && c?.user_id !== null) userIdSet.add(String(c.user_id));
        }
      }
    }

    if (userIdSet.size === 0) {
      return res.status(200).json(orders);
    }

    const ids = Array.from(userIdSet);
    const objectIds = ids.filter(id => /^[0-9a-fA-F]{24}$/.test(id));
    const numericIds = ids.filter(id => !/^[0-9a-fA-F]{24}$/.test(id)).map(n => Number(n)).filter(n => !Number.isNaN(n));

    const orClause: any[] = [];
    if (objectIds.length) orClause.push({ _id: { $in: objectIds } });
    if (numericIds.length) orClause.push({ id: { $in: numericIds } });

    // rechercher les users (par _id et/ou par id numérique) — on récupère aussi le login
    const users = orClause.length ? await User.find({ $or: orClause }).select('firstname name id login').lean() : [];

    // construire un map pour lookup rapide (clefs: _id string et id number -> user object)
    const userMap = new Map<string, { name?: string; firstname?: string; login?: string }>();
    for (const u of users) {
      const userObj = { name: u.name ?? '', firstname: u.firstname ?? '', login: u.login ?? '' };
      if (u._id) userMap.set(String(u._id), userObj);
      if (u.id !== undefined) userMap.set(String(u.id), userObj);
    }

    // mapper orders sans toucher à la BDD : ajouter user (objet) dans chaque history/commentaire
    const mappedOrders = orders.map(o => {
      const oCopy: any = { ...o };
      if (Array.isArray(oCopy.history)) {
        oCopy.history = oCopy.history.map((h: any) => ({
          ...h,
          user: userMap.get(String(h.user_id)) ?? null
        }));
      }
      if (Array.isArray(oCopy.commentaires)) {
        oCopy.commentaires = oCopy.commentaires.map((c: any) => ({
          ...c,
          user: userMap.get(String(c.user_id)) ?? null
        }));
      }
      return oCopy;
    });

    res.status(200).json(mappedOrders);
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
  const { _id, orderId, date, categorie, prixClient, prixAchat, commentaires, watch, history, user_id } = req.body
  if (!_id) return res.status(400).json({ message: 'Missing id parameter' })

  try {
    // Récupère la commande soit par _id Mongo, soit par champ numérique `id`
    let order = null
    if (/^[0-9a-fA-F]{24}$/.test(_id)) {
      order = await Order.findById(_id)
    }
    if (!order) {
      const numericId = Number(_id)
      if (!Number.isNaN(numericId)) {
        order = await Order.findOne({ id: numericId })
      }
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Applique les champs modifiables
    if (orderId !== undefined) order.orderId = orderId
    if (date !== undefined) order.date = date
    if (categorie !== undefined) order.categorie = categorie
    if (prixClient !== undefined) order.prixClient = Math.abs(Number(prixClient ?? 0))
    if (prixAchat !== undefined) order.prixAchat = Math.abs(Number(prixAchat ?? 0))
    if (commentaires !== '') order.commentaires.push({ date: new Date(), commentaire: commentaires, user_id: user_id })
    if (history !== undefined) order.history.push({ date: new Date(), action: history, user_id: user_id })
    if (watch !== undefined) order.watch = watch

    const saved = await order.save()
    return res.status(200).json(saved)
  } catch (error) {
    console.error('Error updating order:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}