/**
 * @fileoverview Sweet Management Service
 * This service handles all business logic related to sweet inventory management,
 * including CRUD operations and transaction handling for sweet items in the shop.
 */
import prisma from "../config/prisma.client";
export class SweetService {
    // Backwards-compatible alias used by unit tests
    async searchSweets(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const where = params.query
            ? {
                OR: [
                    { name: { contains: params.query, mode: "insensitive" } },
                    {
                        category: {
                            contains: params.query,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {};
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
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getSweetById(id) {
        return prisma.sweet.findUnique({ where: { id } });
    }
    async createSweet(dto) {
        const sweet = await prisma.sweet.create({
            data: dto,
        });
        return sweet;
    }
    async getSweets(params = {}) {
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
    async getAllSweets(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const where = {
            AND: [
                params.search
                    ? {
                        OR: [
                            {
                                name: {
                                    contains: params.search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                category: {
                                    contains: params.search,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    }
                    : {},
                params.category ? { category: { equals: params.category } } : {},
            ],
        };
        const [items, total] = await Promise.all([
            prisma.sweet.findMany({
                where,
                skip,
                take: limit,
                orderBy: params.sortBy
                    ? {
                        [params.sortBy]: params.sortOrder || "desc",
                    }
                    : {
                        createdAt: "desc",
                    },
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
    async updateSweet(id, dto) {
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
    async deleteSweet(id) {
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
    async purchaseSweet(sweetId, userId, quantity) {
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
        return prisma.$transaction(async (tx) => {
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
    async restockSweet(sweetId, userId, quantity) {
        if (quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }
        const sweet = await prisma.sweet.findUnique({
            where: { id: sweetId },
        });
        if (!sweet) {
            throw new Error("Sweet not found");
        }
        return prisma.$transaction(async (tx) => {
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
        });
    }
}
