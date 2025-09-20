/**
 * @fileoverview Authentication Routes
 * Defines all authentication-related routes with appropriate middleware and rate limiting
 */

import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  revoke,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  loginLimiter,
  registerLimiter,
  refreshLimiter,
  securityLimiter,
} from "../middlewares/rate-limit.middleware";

const router = Router();

// Public routes with rate limiting
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refreshLimiter, refresh);
router.post("/revoke", securityLimiter, revoke);

// Protected routes
router.post("/logout", authenticate, logout); // No rate limit on logout as it requires authentication

export default router;
