import { Router } from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { SweetController } from "../controllers/sweet.controller";
import upload from "../middlewares/upload.middleware";

const router = Router();
const sweetController = new SweetController();

// Public routes
router.get("/", sweetController.getSweets);
router.get("/search", sweetController.searchSweets);
router.get("/:id", sweetController.getSweet);

// Protected routes that require authentication
router.use(authenticate);
router.post("/:id/purchase", sweetController.purchaseSweet);

// Admin-only routes
router.post(
  "/",
  requireAdmin,
  upload.single("image"),
  sweetController.createSweet
);
router.put("/:id", requireAdmin, sweetController.updateSweet);
router.delete("/:id", requireAdmin, sweetController.deleteSweet);
router.post("/:id/restock", requireAdmin, sweetController.restockSweet);

export default router;
