import type { Request, Response } from "express";

import { AppError } from "../app/AppError";
import { StoreService } from "../services/StoreService";
import type { CreateStoreInput, UpdateStoreInput } from "../types/Store";

export class StoreController {
  constructor(private readonly storeService: StoreService = new StoreService()) {}

  create = (req: Request, res: Response): void => {
    const { name, description, ownerUserId, categoryId } = req.body as Partial<CreateStoreInput>;

    if (!name || typeof name !== "string") {
      throw new AppError(400, "name is required");
    }

    if (description !== undefined && typeof description !== "string") {
      throw new AppError(400, "description must be a string");
    }

    if (!Number.isInteger(ownerUserId) || (ownerUserId as number) <= 0) {
      throw new AppError(400, "ownerUserId is required");
    }

    if (categoryId !== undefined && (!Number.isInteger(categoryId) || (categoryId as number) <= 0)) {
      throw new AppError(400, "categoryId must be a positive integer");
    }

    const store = this.storeService.create({
      name,
      description,
      ownerUserId: ownerUserId as number,
      categoryId
    });

    res.status(201).json(store);
  };

  list = (_req: Request, res: Response): void => {
    res.json(this.storeService.getAll());
  };

  getById = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid store id");
    }

    res.json(this.storeService.getById(id));
  };

  update = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid store id");
    }

    const body = req.body as UpdateStoreInput;

    if (body.name !== undefined && typeof body.name !== "string") {
      throw new AppError(400, "name must be a string");
    }

    if (body.description !== undefined && typeof body.description !== "string") {
      throw new AppError(400, "description must be a string");
    }

    if (body.ownerUserId !== undefined && (!Number.isInteger(body.ownerUserId) || body.ownerUserId <= 0)) {
      throw new AppError(400, "ownerUserId must be a positive integer");
    }

    if (body.categoryId !== undefined) {
      if (body.categoryId !== null && (!Number.isInteger(body.categoryId) || body.categoryId <= 0)) {
        throw new AppError(400, "categoryId must be a positive integer or null");
      }
    }

    res.json(this.storeService.update(id, body));
  };

  delete = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid store id");
    }

    this.storeService.delete(id);
    res.status(204).send();
  };
}
