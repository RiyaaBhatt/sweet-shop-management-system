import prisma from "../config/prisma.client";
export class CartController {
    // Reserve items in stock when adding to cart
    async reserve(req, res, next) {
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body;
            const qty = parseInt(String(quantity || 1), 10);
            if (!productId || qty <= 0)
                return res.status(400).json({ message: "Invalid product or quantity" });
            const result = await prisma.$transaction(async (tx) => {
                const product = await tx.sweet.findUnique({ where: { id: productId } });
                if (!product)
                    throw new Error("Product not found");
                if (product.quantity < qty) {
                    return { success: false, available: product.quantity };
                }
                const updated = await tx.sweet.update({
                    where: { id: productId },
                    data: { quantity: product.quantity - qty },
                });
                await tx.transaction.create({
                    data: {
                        sweetId: productId,
                        userId,
                        qty,
                        type: "reserve",
                    },
                });
                return { success: true, updated };
            });
            if (result.success)
                return res.json({
                    message: "Reserved",
                    product: result.updated,
                });
            return res
                .status(400)
                .json({
                message: "Insufficient stock",
                available: result.available,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
export default new CartController();
