/**
 * @fileoverview Authentication Controller
 * Handles HTTP requests related to user authentication including registration,
 * login, token refresh, and user management. Implements JWT-based authentication.
 */
import { AuthService } from "../services/auth.service";
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 *
 * components:
 *   schemas:
 *     TokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token for API authorization
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token for obtaining new access tokens
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             email:
 *               type: string
 *             role:
 *               type: string
 */
const authService = new AuthService();
// Cookie options for refresh token
const REFRESH_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *       Set-Cookie:
 *         - refreshToken=<token>; HttpOnly; Secure; SameSite=Strict
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        // Set refresh token in HttpOnly cookie for newly registered user
        res.cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
        // Send access token and user in response body (refresh token is in cookie)
        res
            .status(201)
            .json({ user: result.user, accessToken: result.accessToken });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const login = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);
        // Set refresh token in HttpOnly cookie
        res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
        // Send access token in response body
        res.status(200).json({
            user,
            accessToken,
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Get new access token using refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid refresh token
 */
export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }
        const { accessToken } = await authService.refreshToken(refreshToken);
        res.status(200).json({ accessToken });
    }
    catch (err) {
        res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
        res.status(401).json({ message: err.message });
    }
};
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and invalidate refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
export const logout = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (userId) {
            await authService.revokeRefreshTokens(userId);
        }
        res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Public endpoint to revoke refresh tokens for a given user id (used in tests/admin flows)
export const revoke = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.status(400).json({ message: "userId is required" });
        await authService.revokeRefreshTokens(userId);
        // Clear cookie just in case
        res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
        res.status(200).json({ message: "Tokens revoked" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
