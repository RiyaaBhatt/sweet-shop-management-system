import { AuthService } from "../../src/services/auth.service";
import prisma from "../../src/config/prisma.client";
import bcrypt from "bcrypt";
import { signToken } from "../../src/utils/jwt";

// Import jest for runtime utilities
import { jest } from "@jest/globals";

// Mock the modules
jest.mock("../../src/config/prisma.client", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../../src/utils/jwt", () => ({
  signToken: jest.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should throw error if user already exists", async () => {
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue({ id: 1 });
      await expect(
        authService.register({
          email: "test@example.com",
          password: "pass123",
          name: "Test",
        })
      ).rejects.toThrow("User already exists");
    });

    it("should hash password, create user, and return token/user", async () => {
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock<any>).mockResolvedValue("hashedPass");
      (prisma.user.create as jest.Mock<any>).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        role: "user",
      });
      (signToken as jest.Mock<any>).mockReturnValue("jwt.token.here");

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
        },
        select: { id: true, email: true, role: true },
      });
      expect(signToken).toHaveBeenCalledWith({ userId: 1, role: "user" });
      expect(result).toEqual({
        user: { id: 1, email: "test@example.com", role: "user" },
        token: "jwt.token.here",
      });
    });
  });

  describe("login", () => {
    it("should throw error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(null);
      await expect(
        authService.login({ email: "test@example.com", password: "pass123" })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error if password mismatch", async () => {
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue({
        id: 1,
        password: "hashedPass",
      });
      (bcrypt.compare as jest.Mock<any>).mockResolvedValue(false);
      await expect(
        authService.login({ email: "test@example.com", password: "pass123" })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should return token/user on valid credentials", async () => {
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedPass",
        role: "user",
      });
      (bcrypt.compare as jest.Mock<any>).mockResolvedValue(true);
      (signToken as jest.Mock<any>).mockReturnValue("jwt.token.here");

      const result = await authService.login({
        email: "test@example.com",
        password: "pass123",
      });

      expect(bcrypt.compare).toHaveBeenCalledWith("pass123", "hashedPass");
      expect(signToken).toHaveBeenCalledWith({ userId: 1, role: "user" });
      expect(result).toEqual({
        user: { id: 1, email: "test@example.com", role: "user" },
        token: "jwt.token.here",
      });
    });
  });
});
