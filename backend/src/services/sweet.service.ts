/**
 * @fileoverview Sweet Management Service
 * This service handles all business logic related to sweet inventory management,
 * including CRUD operations and transaction handling for sweet items in the shop.
 */

import prisma from "../config/prisma.client";
import { PrismaClient } from "@prisma/client";

/** Type representing a Prisma transaction client without connection methods */
type TransactionPrisma = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

/**
 * Data transfer object for creating a new sweet item
 * @interface CreateSweetDto
 */
interface CreateSweetDto {
  /** The name of the sweet item */
  name: string;
  /** The category of the sweet (e.g., chocolate, candy, etc.) */
  category: string;
  /** The price of the sweet item */
  price: number;
  /** The available quantity in stock */
  quantity: number;
}

/**
 * Data transfer object for updating an existing sweet item
 * @interface UpdateSweetDto
 */
interface UpdateSweetDto {
  /** The updated name of the sweet item */
  name?: string;
  /** The updated category of the sweet */
  category?: string;
  /** The updated price of the sweet item */
  price?: number;
  quantity?: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface SearchParams extends PaginationParams {
  query: string;
}

interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class SweetService {
  async createSweet(dto: CreateSweetDto) {
    const sweet = await prisma.sweet.create({
      data: dto,
    });
    return sweet;
  }

  async getSweets(
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<any>> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.sweet.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.sweet.count(),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async searchSweets(params: SearchParams): Promise<PaginatedResponse<any>> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: params.query, mode: "insensitive" as const } },
        { category: { contains: params.query, mode: "insensitive" as const } },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.sweet.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.sweet.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateSweet(id: number, dto: UpdateSweetDto) {
    const sweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw new Error("Sweet not found");
    }

    return prisma.sweet.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSweet(id: number) {
    const sweet = await prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw new Error("Sweet not found");
    }

    return prisma.sweet.delete({
      where: { id },
    });
  }

  async purchaseSweet(sweetId: number, userId: number, quantity: number) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const sweet = await prisma.sweet.findUnique({
      where: { id: sweetId },
    });

    if (!sweet) {
      throw new Error("Sweet not found");
    }

    if (sweet.quantity < quantity) {
      throw new Error("Insufficient quantity available");
    }

    return prisma.$transaction(async (tx: TransactionPrisma) => {
      const updatedSweet = await tx.sweet.update({
        where: { id: sweetId },
        data: { quantity: sweet.quantity - quantity },
      });

      const transaction = await tx.transaction.create({
        data: {
          sweetId,
          userId,
          qty: quantity,
          type: "purchase",
        },
      });

      return {
        ...updatedSweet,
        transactionId: transaction.id,
      };
    });
  }

  async restockSweet(sweetId: number, userId: number, quantity: number) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const sweet = await prisma.sweet.findUnique({
      where: { id: sweetId },
    });

    if (!sweet) {
      throw new Error("Sweet not found");
    }

    return prisma.$transaction(
      async (
        tx: Omit<
          PrismaClient,
          "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
        >
      ) => {
        const updatedSweet = await tx.sweet.update({
          where: { id: sweetId },
          data: { quantity: sweet.quantity + quantity },
        });

        const transaction = await tx.transaction.create({
          data: {
            sweetId,
            userId,
            qty: quantity,
            type: "restock",
          },
        });

        return {
          ...updatedSweet,
          transactionId: transaction.id,
        };
      }
    );
  }
}
