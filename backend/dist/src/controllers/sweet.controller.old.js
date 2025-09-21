import { SweetService } from "../services/sweet.service";
import prisma from "../config/prisma.client";
/**
 * @swagger
 * tags:
 *   name: Sweets
 *   description: Sweet management endpoints
 */
export class SweetController {
    constructor() {
        /**
         * @swagger
         * /api/sweets:
         *   post:
         *     summary: Create a new sweet
         *     tags: [Sweets]
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             required:
         *               - name
         *               - category
         *               - price
         *               - quantity
         *             properties:
         *               name:
         *                 type: string
         *               category:
         *                 type: string
         *               price:
         *                 type: number
         *               quantity:
         *                 type: integer
         *               image:
         *                 type: string
         *                 format: binary
         *     responses:
         *       201:
         *         description: Sweet created successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Sweet'
         *       400:
         *         description: Invalid input
         *       401:
         *         description: Unauthorized
         *       403:
         *         description: Forbidden - Admin only
         */
        this.createSweet = async (req, res, next) => {
            try {
                const sweetData = {
                    ...req.body,
                    price: parseFloat(req.body.price),
                    quantity: parseInt(req.body.quantity),
                    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
                };
                const sweet = await this.sweetService.createSweet(sweetData);
                res.status(201).json(sweet);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @swagger
         * /api/sweets:
         *   get:
         *     summary: Get all sweets with pagination
         *     tags: [Sweets]
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *           default: 1
         *         description: Page number
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *           default: 10
         *         description: Number of items per page
         *     responses:
         *       200:
         *         description: List of sweets
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 items:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Sweet'
         *                 meta:
         *                   type: object
         *                   properties:
         *                     page:
         *                       type: integer
         *                     limit:
         *                       type: integer
         *                     total:
         *                       type: integer
         *                     totalPages:
         *                       type: integer
         */
        this.getSweets = async (req, res, next) => {
            try {
                const { page = 1, limit = 10 } = req.query;
                const sweets = await this.sweetService.getSweets({
                    page: Number(page),
                    limit: Number(limit),
                });
                res.status(200).json(sweets);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @swagger
         * /api/sweets/search:
         *   get:
         *     summary: Search sweets by name or category
         *     tags: [Sweets]
         *     parameters:
         *       - in: query
         *         name: query
         *         required: true
         *         schema:
         *           type: string
         *         description: Search query string
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *           default: 1
         *         description: Page number
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *           default: 10
         *         description: Number of items per page
         *     responses:
         *       200:
         *         description: Search results
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 items:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Sweet'
         *                 meta:
         *                   type: object
         *                   properties:
         *                     page:
         *                       type: integer
         *                     limit:
         *                       type: integer
         *                     total:
         *                       type: integer
         *                     totalPages:
         *                       type: integer
         *       400:
         *         description: Invalid search query
         */
        this.searchSweets = async (req, res, next) => {
            try {
                const { query, page = 1, limit = 10 } = req.query;
                if (!query || typeof query !== "string") {
                    res.status(400).json({ message: "Search query is required" });
                    return;
                }
                const sweets = await this.sweetService.searchSweets({
                    query,
                    page: Number(page),
                    limit: Number(limit),
                });
                res.status(200).json(sweets);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSweet = async (req, res, next) => {
            try {
                const { id } = req.params;
                const sweet = await prisma.sweet.findUnique({
                    where: { id: Number(id) },
                });
                if (!sweet) {
                    res.status(404).json({ message: "Sweet not found" });
                    return;
                }
                res.status(200).json(sweet);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSweet = async (req, res, next) => {
            try {
                const { id } = req.params;
                const sweet = await this.sweetService.updateSweet(Number(id), req.body);
                if (!sweet) {
                    res.status(404).json({ message: "Sweet not found" });
                    return;
                }
                res.status(200).json(sweet);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteSweet = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.sweetService.deleteSweet(Number(id));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @swagger
         * /api/sweets/{id}/purchase:
         *   post:
         *     summary: Purchase a sweet
         *     tags: [Sweets]
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: Sweet ID
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - quantity
         *             properties:
         *               quantity:
         *                 type: integer
         *                 minimum: 1
         *     responses:
         *       200:
         *         description: Purchase successful
         *         content:
         *           application/json:
         *             schema:
         *               allOf:
         *                 - $ref: '#/components/schemas/Sweet'
         *                 - type: object
         *                   properties:
         *                     transactionId:
         *                       type: integer
         *       400:
         *         description: Invalid quantity or insufficient stock
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Sweet not found
         */
        this.purchaseSweet = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { quantity } = req.body;
                const userId = req.user?.id;
                if (typeof quantity !== "number" || quantity <= 0) {
                    res.status(400).json({ message: "Valid quantity is required" });
                    return;
                }
                if (!userId) {
                    res.status(401).json({ message: "User must be authenticated" });
                    return;
                }
                const sweet = await this.sweetService.purchaseSweet(Number(id), Number(userId), quantity);
                res.status(200).json(sweet);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Insufficient quantity available") {
                        res.status(400).json({ message: error.message });
                        return;
                    }
                    if (error.message === "Sweet not found") {
                        res.status(404).json({ message: error.message });
                        return;
                    }
                }
                next(error);
            }
        };
        /**
         * @swagger
         * /api/sweets/{id}/restock:
         *   post:
         *     summary: Restock a sweet (Admin only)
         *     tags: [Sweets]
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: Sweet ID
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - quantity
         *             properties:
         *               quantity:
         *                 type: integer
         *                 minimum: 1
         *     responses:
         *       200:
         *         description: Restock successful
         *         content:
         *           application/json:
         *             schema:
         *               allOf:
         *                 - $ref: '#/components/schemas/Sweet'
         *                 - type: object
         *                   properties:
         *                     transactionId:
         *                       type: integer
         *       400:
         *         description: Invalid quantity
         *       401:
         *         description: Unauthorized
         *       403:
         *         description: Forbidden - Admin only
         *       404:
         *         description: Sweet not found
         */
        this.restockSweet = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { quantity } = req.body;
                if (typeof quantity !== "number" || quantity <= 0) {
                    res.status(400).json({ message: "Valid quantity is required" });
                    return;
                }
                const sweet = await this.sweetService.restockSweet(Number(id), Number(req.user?.id), quantity);
                res.status(200).json(sweet);
            }
            catch (error) {
                next(error);
            }
        };
        this.sweetService = new SweetService();
    }
}
