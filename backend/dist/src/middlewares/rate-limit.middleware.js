/**
 * @fileoverview Rate Limiting Middleware
 * Configures rate limiting for different authentication endpoints to prevent abuse
 * and enhance security. Rate limits are disabled in test environment.
 */
import rateLimit from "express-rate-limit";
// Common configuration for rate limiters
const isTestEnv = process.env.NODE_ENV === "test";
/**
 * Creates a rate limiter with test environment bypass
 * @param options Rate limiting options
 */
const createRateLimiter = (options) => {
    return rateLimit({
        windowMs: options.windowMs,
        max: isTestEnv ? Infinity : options.max, // No limit in test environment
        message: options.message,
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => isTestEnv, // Skip rate limiting in test environment
    });
};
/**
 * Rate limiter for login attempts
 * Prevents brute force attacks by limiting login attempts
 */
export const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per IP
    message: "Too many login attempts, please try again after 15 minutes",
});
/**
 * Rate limiter for user registration
 * Prevents mass account creation and potential spam
 */
export const registerLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registration attempts per IP
    message: "Too many registration attempts, please try again after an hour",
});
/**
 * Rate limiter for token refresh
 * Prevents token refresh abuse and potential DOS attacks
 */
export const refreshLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 refresh attempts per IP
    message: "Too many token refresh attempts, please try again after 1 minute",
});
/**
 * Rate limiter for security-sensitive operations
 * Used for endpoints that could be used in attack vectors
 */
export const securityLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per IP
    message: "Too many attempts, please try again after 15 minutes",
});
