import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import orderController from "../controllers/order.controller";

const router = Router();

router.use(authenticate);

router.post("/", (req, res, next) =>
  orderController.createOrder(req, res, next)
);
router.get("/", (req, res, next) =>
  orderController.getUserOrders(req, res, next)
);
router.get("/:id", (req, res, next) =>
  orderController.getOrder(req, res, next)
);

export default router;
