import { Router } from "express";
import { requireAdmin, authenticate } from "../middlewares/auth.middleware";
import adminController from "../controllers/admin.controller";

const router = Router();

// require authentication first, then admin role
router.use(authenticate);
router.use(requireAdmin);

router.get("/orders", (req, res, next) =>
  adminController.getAllOrders(req, res, next)
);
router.get("/orders/:id", (req, res, next) =>
  adminController.getOrderById(req, res, next)
);
router.put("/orders/:id/status", (req, res, next) =>
  adminController.updateOrderStatus(req, res, next)
);
router.get("/stats", (req, res, next) =>
  adminController.getStats(req, res, next)
);
router.get("/reports/top-products", (req, res, next) =>
  adminController.getTopProducts(req, res, next)
);
router.get("/reports/sales-by-day", (req, res, next) =>
  adminController.getSalesByDay(req, res, next)
);

export default router;
