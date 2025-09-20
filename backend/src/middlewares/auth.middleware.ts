/**
 * @fileoverview Authentication Middleware
 * This module provides middleware functions for authenticating and authorizing requests.
 * It extends the Express Request interface to include user information and handles JWT verification.
 */

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt";
import prisma from "../config/prisma.client";

/**
 * Extends Express Request to include authenticated user information
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Authenticated user information
       * @property {number} id - User's unique identifier
       * @property {string} role - User's role (e.g., 'admin', 'user')
       * @property {string} email - User's email address
       * @property {number} [tokenVersion] - Optional version number for token validation
       */
      user?: {
        id: number;
        role: string;
        email: string;
        tokenVersion?: number;
      };
    }
  }
}

/**
 * Authentication middleware to verify JWT tokens and attach user information to request
 * @async
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "No access token provided" });
    }

    const token = header.split(" ")[1];
    const payload = verifyAccessToken<TokenPayload>(token);

    // Verify user exists and token version matches
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, email: true, tokenVersion: true },
    });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (err) {
    // If access token is expired, client should use refresh token
    return res.status(401).json({
      message: "Access token expired",
      code: "TOKEN_EXPIRED",
    });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  next();
}
