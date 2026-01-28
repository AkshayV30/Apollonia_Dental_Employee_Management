import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
  res.json({ msg: 'Signup placeholder' });
};

export const login = async (req: Request, res: Response) => {
  const token = jwt.sign({ user: 'demo' }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
  res.json({ token });
};

export const dashboard = (req: any, res: Response) => {
  res.json({ msg: `Welcome ${req.user}` });
};
