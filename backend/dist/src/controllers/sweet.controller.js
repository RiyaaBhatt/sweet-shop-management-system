import { SweetService } from "../services/sweet.service";
export class SweetController {
    constructor() {
        this.getAllSweets = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search;
                // Support legacy 'query' param used by tests
                const queryParam = req.query.query;
                const searchTerm = search ?? queryParam;
                const category = req.query.category;
                const sortBy = req.query.sortBy;
                const sortOrder = req.query.sortOrder;
                const result = await this.sweetService.getAllSweets({
                    page,
                    limit,
                    search: searchTerm,
                    category,
                    sortBy,
                    sortOrder,
                    query: "",
                });
                // normalize items image -> imageUrl
                const normalized = {
                    items: result.items.map((i) => ({
                        ...i,
                        imageUrl: i.image ?? null,
                    })),
                    meta: result.meta,
                };
                res.json(normalized);
            }
            catch (error) {
                next(error);
            }
        };
        this.createSweet = async (req, res, next) => {
            try {
                const body = req.body ?? {};
                const parsedPrice = body.price !== undefined && body.price !== ""
                    ? parseFloat(String(body.price))
                    : undefined;
                const rawQuantity = body.quantity !== undefined
                    ? body.quantity
                    : body.stock !== undefined
                        ? body.stock
                        : undefined;
                const parsedQuantity = rawQuantity !== undefined && rawQuantity !== ""
                    ? parseInt(String(rawQuantity))
                    : undefined;
                // Pick only allowed fields to avoid passing unexpected keys (like stock)
                const sweetData = {
                    name: body.name,
                    description: body.description ?? "",
                    category: body.category,
                    price: parsedPrice,
                    quantity: parsedQuantity,
                    image: req.file ? req.file.filename : undefined,
                    isAvailable: parsedQuantity !== undefined ? parsedQuantity > 0 : undefined,
                };
                if (body.featured !== undefined)
                    sweetData.featured = body.featured === "true" || body.featured === true;
                if (body.sugarFree !== undefined)
                    sweetData.sugarFree =
                        body.sugarFree === "true" || body.sugarFree === true;
                const sweet = await this.sweetService.createSweet(sweetData);
                // normalize to imageUrl for client expectations
                const img = sweet.image
                    ? `/uploads/${String(sweet.image).replace(/^\//, "")}`
                    : null;
                const resp = { ...sweet, imageUrl: img };
                res.status(201).json(resp);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSweetById = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id);
                const sweet = await this.sweetService.getSweetById(id);
                if (sweet === null) {
                    res.status(404).json({ message: "Sweet not found" });
                    return;
                }
                res.json(sweet);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSweet = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id);
                const body = req.body ?? {};
                const parsedPrice = body.price !== undefined && body.price !== ""
                    ? parseFloat(String(body.price))
                    : undefined;
                const rawQuantity = body.quantity !== undefined
                    ? body.quantity
                    : body.stock !== undefined
                        ? body.stock
                        : undefined;
                const parsedQuantity = rawQuantity !== undefined && rawQuantity !== ""
                    ? parseInt(String(rawQuantity))
                    : undefined;
                const sweetData = {
                    name: body.name,
                    description: body.description ?? "",
                    category: body.category,
                    price: parsedPrice,
                    quantity: parsedQuantity,
                    image: req.file ? req.file.filename : undefined,
                    isAvailable: parsedQuantity !== undefined ? parsedQuantity > 0 : undefined,
                };
                if (body.featured !== undefined)
                    sweetData.featured = body.featured === "true" || body.featured === true;
                if (body.sugarFree !== undefined)
                    sweetData.sugarFree =
                        body.sugarFree === "true" || body.sugarFree === true;
                const sweet = await this.sweetService.updateSweet(id, sweetData);
                const imgUpd = sweet.image
                    ? `/uploads/${String(sweet.image).replace(/^\//, "")}`
                    : null;
                const respUpd = { ...sweet, imageUrl: imgUpd };
                res.json(respUpd);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteSweet = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id);
                await this.sweetService.deleteSweet(id);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.purchaseSweet = async (req, res, next) => {
            try {
                const sweetId = parseInt(req.params.id);
                const userId = req.user.id; // User ID from JWT token
                const body = req.body ?? {};
                const quantity = body.quantity !== undefined && body.quantity !== ""
                    ? parseInt(String(body.quantity))
                    : 1;
                const result = await this.sweetService.purchaseSweet(sweetId, userId, quantity);
                res.json(result);
            }
            catch (error) {
                // Map known errors to proper status codes
                const msg = error?.message ?? "Internal error";
                if (msg.includes("Insufficient") ||
                    msg.includes("greater than 0") ||
                    msg.includes("not found")) {
                    res.status(400).json({ message: msg });
                    return;
                }
                next(error);
            }
        };
        this.restockSweet = async (req, res, next) => {
            try {
                const sweetId = parseInt(req.params.id);
                const userId = req.user.id; // Admin ID from JWT token
                const body = req.body ?? {};
                const quantity = body.quantity !== undefined && body.quantity !== ""
                    ? parseInt(String(body.quantity))
                    : 1;
                const result = await this.sweetService.restockSweet(sweetId, userId, quantity);
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.sweetService = new SweetService();
    }
}
