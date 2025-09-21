import { Request, Response, NextFunction } from "express";
import { SweetService } from "../services/sweet.service";
import { Sweet } from "@prisma/client";

export class SweetController {
  private sweetService: SweetService;

  constructor() {
    this.sweetService = new SweetService();
  }

  public getAllSweets = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      // Support legacy 'query' param used by tests
      const queryParam = req.query.query as string;
      const searchTerm = search ?? queryParam;
      const category = req.query.category as string;
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as "asc" | "desc";

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
        items: result.items.map((i: any) => ({
          ...i,
          imageUrl: i.image ?? null,
        })),
        meta: result.meta,
      };
      res.json(normalized);
    } catch (error) {
      next(error);
    }
  };

  public createSweet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const body = req.body ?? {};
      const parsedPrice =
        body.price !== undefined && body.price !== ""
          ? parseFloat(String(body.price))
          : undefined;
      const rawQuantity =
        body.quantity !== undefined
          ? body.quantity
          : body.stock !== undefined
          ? body.stock
          : undefined;
      const parsedQuantity =
        rawQuantity !== undefined && rawQuantity !== ""
          ? parseInt(String(rawQuantity))
          : undefined;

      // Pick only allowed fields to avoid passing unexpected keys (like stock)
      const sweetData: any = {
        name: body.name,
        description: body.description ?? "",
        category: body.category,
        price: parsedPrice,
        quantity: parsedQuantity,
        image: req.file ? req.file.filename : undefined,
        isAvailable:
          parsedQuantity !== undefined ? parsedQuantity > 0 : undefined,
      };
      if (body.featured !== undefined)
        sweetData.featured = body.featured === "true" || body.featured === true;
      if (body.sugarFree !== undefined)
        sweetData.sugarFree =
          body.sugarFree === "true" || body.sugarFree === true;
      const sweet = await this.sweetService.createSweet(sweetData);
      // normalize to imageUrl for client expectations
      const img = (sweet as any).image
        ? `/uploads/${String((sweet as any).image).replace(/^\//, "")}`
        : null;
      const resp = { ...sweet, imageUrl: img };
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getSweetById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const sweet: Sweet | null = await this.sweetService.getSweetById(id);
      if (sweet === null) {
        res.status(404).json({ message: "Sweet not found" });
        return;
      }
      res.json(sweet);
    } catch (error) {
      next(error);
    }
  };

  public updateSweet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const body = req.body ?? {};
      const parsedPrice =
        body.price !== undefined && body.price !== ""
          ? parseFloat(String(body.price))
          : undefined;
      const rawQuantity =
        body.quantity !== undefined
          ? body.quantity
          : body.stock !== undefined
          ? body.stock
          : undefined;
      const parsedQuantity =
        rawQuantity !== undefined && rawQuantity !== ""
          ? parseInt(String(rawQuantity))
          : undefined;

      const sweetData: any = {
        name: body.name,
        description: body.description ?? "",
        category: body.category,
        price: parsedPrice,
        quantity: parsedQuantity,
        image: req.file ? req.file.filename : undefined,
        isAvailable:
          parsedQuantity !== undefined ? parsedQuantity > 0 : undefined,
      };
      if (body.featured !== undefined)
        sweetData.featured = body.featured === "true" || body.featured === true;
      if (body.sugarFree !== undefined)
        sweetData.sugarFree =
          body.sugarFree === "true" || body.sugarFree === true;
      const sweet = await this.sweetService.updateSweet(id, sweetData);
      const imgUpd = (sweet as any).image
        ? `/uploads/${String((sweet as any).image).replace(/^\//, "")}`
        : null;
      const respUpd = { ...sweet, imageUrl: imgUpd };
      res.json(respUpd);
    } catch (error) {
      next(error);
    }
  };

  public deleteSweet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.sweetService.deleteSweet(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  public purchaseSweet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sweetId = parseInt(req.params.id);
      const userId = (req.user as any).id; // User ID from JWT token
      const body = req.body ?? {};
      const quantity =
        body.quantity !== undefined && body.quantity !== ""
          ? parseInt(String(body.quantity))
          : 1;

      const result = await this.sweetService.purchaseSweet(
        sweetId,
        userId,
        quantity
      );
      res.json(result);
    } catch (error) {
      // Map known errors to proper status codes
      const msg = (error as any)?.message ?? "Internal error";
      if (
        msg.includes("Insufficient") ||
        msg.includes("greater than 0") ||
        msg.includes("not found")
      ) {
        res.status(400).json({ message: msg });
        return;
      }
      next(error);
    }
  };

  public restockSweet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sweetId = parseInt(req.params.id);
      const userId = (req.user as any).id; // Admin ID from JWT token
      const body = req.body ?? {};
      const quantity =
        body.quantity !== undefined && body.quantity !== ""
          ? parseInt(String(body.quantity))
          : 1;

      const result = await this.sweetService.restockSweet(
        sweetId,
        userId,
        quantity
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
