import type { Request, Response } from "express";

import { ProductService } from "../services/ProductService";
import { AppError } from "../app/AppError";
import type { CreateProductInput, UpdateProductInput } from "../types/Product";
import verifyStore from "../helpers/StoreHelper";

export class ProductController {
  constructor(
    private readonly productService: ProductService = new ProductService(),
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, inventoryCount, store_id } =
      req.body as Partial<CreateProductInput>;

    if (!name || typeof name !== "string") {
      throw new AppError(400, "name is required");
    }

    if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
      throw new AppError(400, "price must be a non-negative number");
    }

    if (
      typeof store_id !== "number" ||
      Number.isNaN(store_id) ||
      store_id < 0
    ) {
      throw new AppError(400, "store_id is a required property");
    }

    const validStore = await verifyStore(store_id);
    if (!validStore) {
      throw new AppError(400, "The provided store_id is not valid");
    }

    if (
      inventoryCount === undefined ||
      !Number.isInteger(inventoryCount) ||
      inventoryCount < 0
    ) {
      throw new AppError(400, "inventoryCount must be a non-negative integer");
    }

    const safeInventoryCount = inventoryCount as number;

    const product = this.productService.create({
      name,
      description,
      price,
      inventoryCount: safeInventoryCount,
      store_id,
    });

    res.status(201).json(product);
  };

  list = (_req: Request, res: Response): void => {
    res.json(this.productService.getAll());
  };

  getById = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid product id");
    }

    res.json(this.productService.getById(id));
  };

  update = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid product id");
    }

    const body = req.body as UpdateProductInput;

    if (body.name !== undefined && typeof body.name !== "string") {
      throw new AppError(400, "name must be a string");
    }

    if (
      body.description !== undefined &&
      typeof body.description !== "string"
    ) {
      throw new AppError(400, "description must be a string");
    }

    if (
      body.price !== undefined &&
      (typeof body.price !== "number" || body.price < 0)
    ) {
      throw new AppError(400, "price must be a non-negative number");
    }

    if (
      typeof body.store_id !== "number" ||
      Number.isNaN(body.store_id) ||
      body.store_id < 0
    ) {
      throw new AppError(400, "store_id is a required property");
    }

    if (!verifyStore(body.store_id)) {
      throw new AppError(400, "The provided store_id is not valid");
    }

    if (
      body.inventoryCount !== undefined &&
      (!Number.isInteger(body.inventoryCount) || body.inventoryCount < 0)
    ) {
      throw new AppError(400, "inventoryCount must be a non-negative integer");
    }

    res.json(this.productService.update(id, body));
  };

  delete = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid product id");
    }

    this.productService.delete(id);
    res.status(204).send();
  };
}
