// src/services/sweet.service.ts (core)
import prisma from "../config/prisma.client";

export class SweetService {
  async purchase(sweetId: number, qty: number, userId: number) {
    if (qty <= 0) throw new Error("Quantity must be > 0");

    return await prisma.$transaction(async (tx) => {
      const sweet = await tx.sweet.findUnique({ where: { id: sweetId } });
      if (!sweet) throw new Error("Sweet not found");
      if (sweet.quantity < qty) throw new Error("Not enough quantity");

      const newQty = sweet.quantity - qty;
      await tx.sweet.update({
        where: { id: sweetId },
        data: { quantity: newQty },
      });
      const transaction = await tx.transaction.create({
        data: { sweetId, type: "purchase", qty, userId },
      });
      return {
        sweetId,
        purchased: qty,
        remaining: newQty,
        transactionId: transaction.id,
      };
    });
  }

  async restock(sweetId: number, qty: number) {
    if (qty <= 0) throw new Error("Quantity must be > 0");
    return await prisma.$transaction(async (tx) => {
      const sweet = await tx.sweet.findUnique({ where: { id: sweetId } });
      if (!sweet) throw new Error("Sweet not found");
      const newQty = sweet.quantity + qty;
      await tx.sweet.update({
        where: { id: sweetId },
        data: { quantity: newQty },
      });
      const transaction = await tx.transaction.create({
        data: { sweetId, type: "restock", qty },
      });
      return {
        sweetId,
        restocked: qty,
        total: newQty,
        transactionId: transaction.id,
      };
    });
  }
}
