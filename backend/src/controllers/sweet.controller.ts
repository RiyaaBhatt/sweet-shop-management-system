// src/controllers/sweet.controller.ts (snippets)
import { Request, Response } from 'express';
import { SweetService } from '../services/sweet.service';
const sweetService = new SweetService();

export const purchase = async (req: Request, res: Response) => {
  try {
    const sweetId = Number(req.params.id);
    const qty = Number(req.body.qty || 1);
    const userId = req.user.id;
    const result = await sweetService.purchase(sweetId, qty, userId);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const restock = async (req: Request, res: Response) => {
  try {
    const sweetId = Number(req.params.id);
    const qty = Number(req.body.qty || 1);
    const result = await sweetService.restock(sweetId, qty);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
