// @ts-nocheck - Disable type checking for tests
import { jest } from "@jest/globals";
import { SweetService } from "../../src/services/sweet.service";
import { PrismaClient } from "@prisma/client";

// Mock the prisma client module before creating the mock instance
jest.mock("../../src/config/prisma.client");

// Create mock Prisma client after the jest.mock
const mockPrisma = {
  sweet: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

// Update the mock implementation
jest.mocked(require("../../src/config/prisma.client")).default = mockPrisma;

// Provide a local `prisma` alias so tests that reference `prisma` (instead of
// `mockPrisma`) don't throw ReferenceError. This keeps both naming styles working
// in the existing tests.
const prisma: any = mockPrisma;

describe("SweetService", () => {
  let sweetService: SweetService;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    sweetService = new SweetService();

    // Setup default transaction behavior
    mockPrisma.$transaction.mockImplementation(async (callback) => {
      return callback(mockPrisma);
    });
    jest.clearAllMocks();
  });

  describe("createSweet", () => {
    const sweetData = {
      name: "Chocolate Barfi",
      category: "Barfi",
      price: 50.0,
      quantity: 100,
    };

    it("should create a new sweet", async () => {
      mockPrisma.sweet.create.mockResolvedValue({
        id: 1,
        ...sweetData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await sweetService.createSweet(sweetData);

      expect(mockPrisma.sweet.create).toHaveBeenCalledWith({
        data: sweetData,
      });
      expect(result).toHaveProperty("id", 1);
      expect(result).toMatchObject(sweetData);
    });
  });

  describe("getSweets", () => {
    const mockSweets = [
      {
        id: 1,
        name: "Chocolate Barfi",
        category: "Barfi",
        price: 50.0,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Kaju Katli",
        category: "Katli",
        price: 60.0,
        quantity: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it("should return paginated list of sweets", async () => {
      const page = 1;
      const limit = 10;
      const total = 2;

      mockPrisma.sweet.findMany.mockResolvedValue(mockSweets);
      mockPrisma.sweet.count.mockResolvedValue(total);

      const result = await sweetService.getSweets({ page, limit });

      expect(prisma.sweet.findMany).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      expect(result.items).toEqual(mockSweets);
      expect(result.meta).toEqual({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    });
  });

  describe("searchSweets", () => {
    const mockSweets = [
      {
        id: 1,
        name: "Chocolate Barfi",
        category: "Barfi",
        price: 50.0,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it("should search sweets by query", async () => {
      const query = "Chocolate";
      const page = 1;
      const limit = 10;
      const total = 1;

      mockPrisma.sweet.findMany.mockResolvedValue(mockSweets);
      mockPrisma.sweet.count.mockResolvedValue(total);

      const result = await sweetService.searchSweets({ query, page, limit });

      expect(prisma.sweet.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
          ],
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      expect(result.items).toEqual(mockSweets);
      expect(result.meta).toEqual({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    });
  });

  describe("updateSweet", () => {
    const sweetId = 1;
    const updateData = {
      price: 55.0,
      quantity: 90,
    };

    it("should throw error if sweet not found", async () => {
      mockPrisma.sweet.findUnique.mockResolvedValue(null);

      await expect(
        sweetService.updateSweet(sweetId, updateData)
      ).rejects.toThrow("Sweet not found");
    });

    it("should update sweet details", async () => {
      const existingSweet = {
        id: sweetId,
        name: "Chocolate Barfi",
        category: "Barfi",
        price: 50.0,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrisma.sweet.update.mockResolvedValue({
        ...existingSweet,
        ...updateData,
      });

      const result = await sweetService.updateSweet(sweetId, updateData);

      expect(mockPrisma.sweet.update).toHaveBeenCalledWith({
        where: { id: sweetId },
        data: updateData,
      });
      expect(result).toMatchObject({
        ...existingSweet,
        ...updateData,
      });
    });
  });

  describe("deleteSweet", () => {
    const sweetId = 1;

    it("should throw error if sweet not found", async () => {
      (prisma.sweet.findUnique as jest.Mock<any>).mockResolvedValue(null);

      await expect(sweetService.deleteSweet(sweetId)).rejects.toThrow(
        "Sweet not found"
      );
    });

    it("should delete the sweet", async () => {
      const existingSweet = {
        id: sweetId,
        name: "Chocolate Barfi",
        category: "Barfi",
        price: 50.0,
        quantity: 100,
      };

      (prisma.sweet.findUnique as jest.Mock<any>).mockResolvedValue(
        existingSweet
      );
      (prisma.sweet.delete as jest.Mock<any>).mockResolvedValue(existingSweet);

      const result = await sweetService.deleteSweet(sweetId);

      expect(prisma.sweet.delete).toHaveBeenCalledWith({
        where: { id: sweetId },
      });
      expect(result).toMatchObject(existingSweet);
    });
  });

  describe("purchaseSweet", () => {
    const sweetId = 1;
    const userId = 1;
    const quantity = 5;

    it("should throw error if sweet not found", async () => {
      (prisma.sweet.findUnique as jest.Mock<any>).mockResolvedValue(null);

      await expect(
        sweetService.purchaseSweet(sweetId, userId, quantity)
      ).rejects.toThrow("Sweet not found");
    });

    it("should throw error if insufficient quantity", async () => {
      mockPrisma.sweet.findUnique.mockResolvedValue({
        id: sweetId,
        quantity: 3,
      });

      await expect(
        sweetService.purchaseSweet(sweetId, userId, quantity)
      ).rejects.toThrow("Insufficient quantity available");
    });

    it("should process purchase successfully", async () => {
      const existingSweet = {
        id: sweetId,
        name: "Chocolate Barfi",
        price: 50.0,
        quantity: 10,
      };

      const updatedSweet = {
        ...existingSweet,
        quantity: existingSweet.quantity - quantity,
      };

      mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrisma.sweet.update.mockResolvedValue(updatedSweet);
      mockPrisma.transaction.create.mockResolvedValue({
        id: 1,
        sweetId,
        userId,
        qty: quantity,
        type: "purchase",
      });

      const result = await sweetService.purchaseSweet(
        sweetId,
        userId,
        quantity
      );

      expect(prisma.sweet.update).toHaveBeenCalledWith({
        where: { id: sweetId },
        data: { quantity: existingSweet.quantity - quantity },
      });
      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          sweetId,
          userId,
          qty: quantity,
          type: "purchase",
        },
      });
      expect(result).toMatchObject(updatedSweet);
    });
  });

  describe("restockSweet", () => {
    const sweetId = 1;
    const userId = 1;
    const quantity = 50;

    it("should throw error if sweet not found", async () => {
      (prisma.sweet.findUnique as jest.Mock<any>).mockResolvedValue(null);

      await expect(
        sweetService.restockSweet(sweetId, userId, quantity)
      ).rejects.toThrow("Sweet not found");
    });

    it("should process restock successfully", async () => {
      const existingSweet = {
        id: sweetId,
        name: "Chocolate Barfi",
        quantity: 10,
      };

      const updatedSweet = {
        ...existingSweet,
        quantity: existingSweet.quantity + quantity,
      };

      (prisma.sweet.findUnique as jest.Mock<any>).mockResolvedValue(
        existingSweet
      );
      (prisma.$transaction as jest.Mock<any>).mockImplementation(
        async (callback) => {
          return callback(prisma);
        }
      );
      (prisma.sweet.update as jest.Mock<any>).mockResolvedValue(updatedSweet);
      (prisma.transaction.create as jest.Mock<any>).mockResolvedValue({
        id: 1,
        sweetId,
        userId,
        quantity,
        type: "restock",
      });

      const result = await sweetService.restockSweet(sweetId, userId, quantity);

      expect(prisma.sweet.update).toHaveBeenCalledWith({
        where: { id: sweetId },
        data: { quantity: existingSweet.quantity + quantity },
      });
      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          sweetId,
          userId,
          qty: quantity,
          type: "restock",
        },
      });
      expect(result).toMatchObject(updatedSweet);
    });
  });
});
