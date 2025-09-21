import { AuthService } from "../../src/services/auth.service";
import prisma from "../../src/config/prisma.client";
import bcrypt from "bcrypt";
import { generateTokens, verifyRefreshToken } from "../../src/utils/jwt";
// Import jest for runtime utilities
import { jest } from "@jest/globals";
// Mock the modules
jest.mock("../../src/config/prisma.client", () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
}));
jest.mock("bcrypt", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));
jest.mock("../../src/utils/jwt", () => ({
    generateTokens: jest.fn(),
    verifyRefreshToken: jest.fn(),
}));
describe("AuthService", () => {
    let authService;
    beforeEach(() => {
        authService = new AuthService();
        jest.clearAllMocks();
    });
    describe("register", () => {
        it("should throw error if user already exists", async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 1 });
            await expect(authService.register({
                email: "test@example.com",
                password: "pass123",
                name: "Test",
            })).rejects.toThrow("User already exists");
        });
        it("should hash password, create user, and return tokens/user", async () => {
            const mockTokens = {
                accessToken: "access.token.here",
                refreshToken: "refresh.token.here",
            };
            prisma.user.findUnique.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashedPass");
            prisma.user.create.mockResolvedValue({
                id: 1,
                email: "test@example.com",
                role: "user",
                tokenVersion: 0,
            });
            generateTokens.mockReturnValue(mockTokens);
            prisma.user.update.mockResolvedValue({ id: 1 });
            const result = await authService.register({
                email: "test@example.com",
                password: "pass123",
                name: "Test",
            });
            expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: "test@example.com",
                    password: "hashedPass",
                    name: "Test",
                    role: "user",
                    tokenVersion: 0,
                },
                select: { id: true, email: true, role: true, tokenVersion: true },
            });
            expect(generateTokens).toHaveBeenCalledWith({
                userId: 1,
                role: "user",
                email: "test@example.com",
                tokenVersion: 0,
            });
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { refreshToken: mockTokens.refreshToken },
            });
            expect(result).toEqual({
                user: { id: 1, email: "test@example.com", role: "user" },
                accessToken: mockTokens.accessToken,
                refreshToken: mockTokens.refreshToken,
            });
        });
    });
    describe("login", () => {
        it("should throw error if user not found", async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(authService.login({ email: "test@example.com", password: "pass123" })).rejects.toThrow("Invalid credentials");
        });
        it("should throw error if password mismatch", async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 1,
                password: "hashedPass",
            });
            bcrypt.compare.mockResolvedValue(false);
            await expect(authService.login({ email: "test@example.com", password: "pass123" })).rejects.toThrow("Invalid credentials");
        });
        it("should return tokens/user on valid credentials", async () => {
            const mockTokens = {
                accessToken: "access.token.here",
                refreshToken: "refresh.token.here",
            };
            prisma.user.findUnique.mockResolvedValue({
                id: 1,
                email: "test@example.com",
                password: "hashedPass",
                role: "user",
                tokenVersion: 0,
            });
            bcrypt.compare.mockResolvedValue(true);
            generateTokens.mockReturnValue(mockTokens);
            prisma.user.update.mockResolvedValue({ id: 1 });
            const result = await authService.login({
                email: "test@example.com",
                password: "pass123",
            });
            expect(bcrypt.compare).toHaveBeenCalledWith("pass123", "hashedPass");
            expect(generateTokens).toHaveBeenCalledWith({
                userId: 1,
                role: "user",
                email: "test@example.com",
                tokenVersion: 0,
            });
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { refreshToken: mockTokens.refreshToken },
            });
            expect(result).toEqual({
                user: { id: 1, email: "test@example.com", role: "user" },
                accessToken: mockTokens.accessToken,
                refreshToken: mockTokens.refreshToken,
            });
        });
    });
    describe("refreshToken", () => {
        it("should throw error if token is invalid", async () => {
            verifyRefreshToken.mockImplementation(() => {
                throw new Error();
            });
            await expect(authService.refreshToken("invalid.token")).rejects.toThrow("Invalid refresh token");
        });
        it("should throw error if user not found", async () => {
            verifyRefreshToken.mockReturnValue({
                userId: 1,
                tokenVersion: 0,
            });
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(authService.refreshToken("valid.token")).rejects.toThrow("User not found");
        });
        it("should throw error if token versions don't match", async () => {
            verifyRefreshToken.mockReturnValue({
                userId: 1,
                tokenVersion: 0,
            });
            prisma.user.findUnique.mockResolvedValue({
                id: 1,
                tokenVersion: 1,
                refreshToken: "valid.token",
            });
            await expect(authService.refreshToken("valid.token")).rejects.toThrow("Token has been revoked");
        });
        it("should return new access token on success", async () => {
            const mockTokens = {
                accessToken: "new.access.token",
                refreshToken: "refresh.token",
            };
            verifyRefreshToken.mockReturnValue({
                userId: 1,
                tokenVersion: 0,
            });
            prisma.user.findUnique.mockResolvedValue({
                id: 1,
                email: "test@example.com",
                role: "user",
                tokenVersion: 0,
                refreshToken: "valid.token",
            });
            generateTokens.mockReturnValue(mockTokens);
            const result = await authService.refreshToken("valid.token");
            expect(result).toEqual({ accessToken: mockTokens.accessToken });
        });
    });
    describe("revokeRefreshTokens", () => {
        it("should increment token version and clear refresh token", async () => {
            prisma.user.update.mockResolvedValue({
                id: 1,
                tokenVersion: 1,
                refreshToken: null,
            });
            const result = await authService.revokeRefreshTokens(1);
            expect(result).toBe(true);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    tokenVersion: { increment: 1 },
                    refreshToken: null,
                },
            });
        });
    });
});
