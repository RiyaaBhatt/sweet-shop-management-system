import { OrderService } from "../services/order.service";
const orderService = new OrderService();
export class OrderController {
    async createOrder(req, res, next) {
        try {
            const userId = req.user.id;
            const items = req.body.items;
            const delivery = req.body.delivery || null;
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }
            const order = await orderService.createOrder(userId, items, delivery);
            res.status(201).json(order);
        }
        catch (err) {
            next(err);
        }
    }
    async getUserOrders(req, res, next) {
        try {
            const userId = req.user.id;
            const orders = await orderService.getOrdersForUser(userId);
            res.json(orders);
        }
        catch (err) {
            next(err);
        }
    }
    async getOrder(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const order = await orderService.getOrderById(id);
            if (!order)
                return res.status(404).json({ message: "Order not found" });
            res.json(order);
        }
        catch (err) {
            next(err);
        }
    }
}
export default new OrderController();
