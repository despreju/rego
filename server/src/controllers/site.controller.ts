import { Request, Response } from 'express';
import Site from '../models/site.model';
import User from '../models/user.model';
import mongoose from 'mongoose';

export const createSite = async (req: Request, res: Response) => {
  const name = req.body.siteName.toString().trim();
  const userId = req.body.user_id as string | undefined;

  if (!name) return res.status(400).json({ message: 'Missing site name' });

  try {
    const exists = await Site.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: 'Site with this name already exists', site: exists });
    }

    const site = new Site({ name });
    await site.save();

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const already = Array.isArray(user.sitesId) && user.sitesId.some((s: any) =>
          String(s._id) === String(site._id) || String(s.name) === String(site.name)
        );

        if (!already) {
          user.sitesId.push(String(site._id));
          await user.save();
        }
      }
    }

    return res.status(201).json({ site });
  } catch (error) {
    console.error('createSite error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getSitesForUser = async (req: Request, res: Response) => {
  const userId = (req.body.user_id ?? req.params.user_id ?? req.query.user_id) as string | undefined;
  if (!userId) return res.status(400).json({ message: 'Missing user_id' });

  try {
    // récupérer uniquement le champ sitesId du user
    const user = await User.findById(userId).select('sitesId').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rawIds = Array.isArray((user as any).sitesId) ? (user as any).sitesId : [];

    // garder seulement les ObjectId valides
    const validIds = rawIds
      .map((v: any) => String(v))
      .filter((id: string) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) return res.status(200).json({ sites: [] });

    // récupérer tous les Site dont _id est dans sitesId
    const sites = await Site.find({ _id: { $in: validIds } }).lean();

    return res.status(200).json({ sites });
  } catch (error) {
    console.error('getSitesForUser error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllSites = async (req: Request, res: Response) => {
  try {
    // optionnel : support d'une recherche par nom via ?q=...
    const q = (req.query?.q ?? '').toString().trim();
    const filter: any = {};
    if (q) {
      const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = new RegExp(`^${escapeRegExp(q)}`, 'i');
    }

    const sites = await Site.find(filter).select('-__v').lean();
    return res.status(200).json({ sites });
  } catch (error) {
    console.error('getAllSites error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getSite = async (req: Request, res: Response) => {
  const siteNameRaw = (req.body?.siteName).toString().trim();
  if (!siteNameRaw) return res.status(400).json({ message: 'Missing siteName' });

  try {
    // if an ObjectId was passed, try by id first
    let site: any = null;
    if (/^[0-9a-fA-F]{24}$/.test(siteNameRaw)) {
      site = await Site.findById(siteNameRaw).select('-__v').lean().catch(() => null);
    }

    if (!site) {
      const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      site = await Site.findOne({ name: new RegExp(`^${escapeRegExp(siteNameRaw)}$`, 'i') })
        .select('-__v')
        .lean()
        .catch(() => null);
    }

    if (!site) return res.status(404).json({ message: 'Site not found' });
    return res.status(200).json({ site });
  } catch (error) {
    console.error('getSite error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};