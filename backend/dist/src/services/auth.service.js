import prisma from "../config/prisma.client";
import bcrypt from "bcrypt";
import { generateTokens, verifyRefreshToken } from "../utils/jwt";
export class AuthService {
    async register(dto) {
        const existing = await prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing)
            throw new Error("User already exists");
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await prisma.user.create({
            data: {
                email: dto.email,
                password: hashed,
                name: dto.name,
                role: "user",
                tokenVersion: 0,
            },
            select: { id: true, email: true, role: true, tokenVersion: true },
        });
        const { accessToken, refreshToken } = generateTokens({
            userId: user.id,
            role: user.role,
            email: user.email,
            tokenVersion: 0, // Use initial tokenVersion since this is a new user registration
        });
        // Store refresh token in database
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return {
            user: { id: user.id, email: user.email, role: user.role },
            accessToken,
            refreshToken,
        };
    }
    async login(dto) {
        const user = await prisma.user.findUnique({
            where: { email: dto.email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                tokenVersion: true,
            },
        });
        if (!user)
            throw new Error("Invalid credentials");
        const match = await bcrypt.compare(dto.password, user.password);
        if (!match)
            throw new Error("Invalid credentials");
        const { accessToken, refreshToken } = generateTokens({
            userId: user.id,
            role: user.role,
            email: user.email,
            tokenVersion: user.tokenVersion,
        });
        // Store refresh token in database
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return {
            user: { id: user.id, email: user.email, role: user.role },
            accessToken,
            refreshToken,
        };
    }
    async refreshToken(token) {
        try {
            const payload = verifyRefreshToken(token);
            // Get user and verify token version
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    tokenVersion: true,
                    refreshToken: true,
                },
            });
            if (!user)
                throw new Error("User not found");
            // If the token version stored in DB doesn't match the token's version,
            // the token has been revoked.
            if (user.tokenVersion !== payload.tokenVersion)
                throw new Error("Token has been revoked");
            // Then ensure the refresh token matches what we have stored.
            if (user.refreshToken !== token)
                throw new Error("Invalid refresh token");
            const accessToken = generateTokens({
                userId: user.id,
                role: user.role,
                email: user.email,
                tokenVersion: user.tokenVersion,
            }).accessToken;
            return { accessToken };
        }
        catch (error) {
            // Preserve specific domain errors but map parsing/verification errors
            // from the JWT library to a consistent message expected by tests.
            const msg = error && error.message ? String(error.message) : "";
            if (msg === "User not found" || msg === "Token has been revoked") {
                throw error;
            }
            // For anything else (jwt malformed, invalid signature, etc.) return a
            // normalized message to avoid leaking internal error strings into API
            // responses and to match test expectations.
            throw new Error("Invalid refresh token");
        }
    }
    async revokeRefreshTokens(userId) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                tokenVersion: { increment: 1 },
                refreshToken: null,
            },
        });
        return true;
    }
}
