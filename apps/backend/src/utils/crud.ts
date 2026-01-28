import { Request, Response } from 'express';
import { Model } from 'mongoose';

export function createCRUDController<T>(model: Model<T>) {
  return {
    getAll: async (req: Request, res: Response) => {
      const items = await model.find();
      res.json(items);
    },

    create: async (req: Request, res: Response) => {
      try {
        const doc = new model(req.body);
        await doc.save();
        res.status(201).json(doc);
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    },
  };
}
