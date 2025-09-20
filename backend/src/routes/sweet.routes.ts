import { Router } from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { SweetController } from "../controllers/sweet.controller";
import upload from "../middlewares/upload.middleware";

const router = Router();
const sweetController = new SweetController();

// Public routes
router.get("/", sweetController.getAllSweets);
router.get("/search", sweetController.getAllSweets); // using same handler for search as it's handled by query params
router.get("/:id", sweetController.getSweetById);

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
router.put(
  "/:id",
  requireAdmin,
  upload.single("image"),
  sweetController.updateSweet
);
router.delete("/:id", requireAdmin, sweetController.deleteSweet);
router.post("/:id/restock", requireAdmin, sweetController.restockSweet);

export default router;
