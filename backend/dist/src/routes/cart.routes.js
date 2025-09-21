import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import cartController from "../controllers/cart.controller";
const router = Router();
router.use(authenticate);
router.post("/reserve", (req, res, next) => cartController.reserve(req, res, next));
export default router;
