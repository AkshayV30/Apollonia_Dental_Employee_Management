import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";

export function createCRUDController<T>(model: Model<T>) {
  return {
    getAll: async (_: Request, res: Response, next: NextFunction) => {
      try {
        const items = await model.find().lean();
        res.json(items);
      } catch (err) {
        next(err);
      }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const doc = await model.create(req.body);
        res.status(201).json(doc);
      } catch (err) {
        next(err);
      }
    },
  };
}
