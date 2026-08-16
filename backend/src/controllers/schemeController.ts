import { Request, Response } from 'express';
import { GovernmentScheme } from '../models/GovernmentScheme.js';

export const getSchemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const schemes = await GovernmentScheme.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, schemes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
