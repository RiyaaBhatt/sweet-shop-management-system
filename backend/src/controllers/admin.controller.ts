import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();

export class AdminController {
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, status, from, to } = req.query as any;
      const page = req.query.page
        ? parseInt(String(req.query.page), 10)
        : undefined;
      const pageSize = req.query.pageSize
        ? parseInt(String(req.query.pageSize), 10)
        : undefined;
      // build filter object for prisma
      const where: any = {};
      if (userId) where.userId = parseInt(userId, 10);
      if (status) where.status = status;
      if (from || to) where.createdAt = {};
      if (from) where.createdAt.gte = new Date(String(from));
      if (to) where.createdAt.lte = new Date(String(to));

      try {
        const prismaClient = (await import("../config/prisma.client"))
          .default as any;
        const findOpts: any = {
          where,
          include: { items: { include: { product: true } }, user: true },
          orderBy: { createdAt: "desc" },
        };
        if (page && pageSize) {
          findOpts.skip = (page - 1) * pageSize;
          findOpts.take = pageSize;
        }

        const orders = await prismaClient.order.findMany(findOpts);
        res.json(orders);
      } catch (err) {
        // fallback to service
        const opts: any = {};
        if (userId) opts.userId = parseInt(userId, 10);
        if (status) opts.status = status;
        if (from) opts.from = new Date(String(from));
        if (to) opts.to = new Date(String(to));
        if (page) opts.page = page;
        if (pageSize) opts.pageSize = pageSize;
        const orders = await orderService.getAllOrders(opts);
        res.json(orders);
      }
    } catch (err) {
      next(err);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!status)
        return res.status(400).json({ message: "status is required" });
      const updated = await orderService.updateOrderStatus(id, status);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await orderService.getAdminStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }

  async getTopProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit
        ? parseInt(String(req.query.limit), 10)
        : 10;
      const data = await orderService.getTopSellingProducts(limit);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params.id), 10);
      try {
        const prismaClient = (await import("../config/prisma.client"))
          .default as any;
        const order = await prismaClient.order.findUnique({
          where: { id },
          include: { items: { include: { product: true } }, user: true },
        });
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.json(order);
      } catch (err) {
        // fallback
        const order = (await new OrderService().getOrderById(id)) as any;
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.json(order);
      }
    } catch (err) {
      next(err);
    }
  }

  async getSalesByDay(req: Request, res: Response, next: NextFunction) {
    try {
      const { days, from, to } = req.query as any;
      if (from || to) {
        const fromDate = from ? new Date(String(from)) : new Date(0);
        const toDate = to ? new Date(String(to)) : new Date();
        const data = await orderService.getSalesByRange(fromDate, toDate);
        return res.json(data);
      }

      const d = days ? parseInt(String(days), 10) : 30;
      const data = await orderService.getSalesByDay(d);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

export default new AdminController();
