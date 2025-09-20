// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import prisma from "../config/prisma.client";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Not authorized" });
  const token = header.split(" ")[1];
  try {
    const payload: any = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return res.status(401).json({ message: "Invalid token user" });
    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  next();
}
