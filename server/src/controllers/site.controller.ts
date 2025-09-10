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
        const already = Array.isArray(user.sites) && user.sites.some((s: any) =>
          String(s._id) === String(site._id) || String(s.name) === String(site.name)
        );

        if (!already) {
          user.sites.push(site.toObject ? site.toObject() : site);
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
    const user = await User.findById(userId).select('sites').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rawSites = Array.isArray((user as any).sites) ? (user as any).sites : [];

    const embeddedSites: any[] = [];
    const idCandidates: string[] = [];

    for (const s of rawSites) {
      if (!s) continue;
      if (typeof s === 'string') {
        if (mongoose.Types.ObjectId.isValid(s)) idCandidates.push(s);
        // else: string not an ObjectId -> could be a name or invalid, ignore or handle as needed
      } else if (typeof s === 'object') {
        // if the object has a valid _id, treat it as a reference candidate
        if (s._id && mongoose.Types.ObjectId.isValid(String(s._id))) {
          idCandidates.push(String(s._id));
        } else {
          // embedded subdocument (no valid _id) -> keep as-is
          embeddedSites.push(s);
        }
      }
    }

    let referencedSites: any[] = [];
    if (idCandidates.length > 0) {
      // fetch only valid ObjectId references
      referencedSites = await Site.find({ _id: { $in: idCandidates } }).lean();
    }

    // combine and dedupe by _id (or stringify for embedded)
    const map: Record<string, any> = {};
    for (const s of [...embeddedSites, ...referencedSites]) {
      const key = String(s._id ?? JSON.stringify(s));
      map[key] = s;
    }
    const sites = Object.values(map);

    return res.status(200).json({ sites });
  } catch (error) {
    console.error('getSitesForUser error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};