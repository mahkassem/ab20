import type { Request, Response } from "express";

import { AppError } from "../app/AppError";
import { CategoryService } from "../services/CategoryService";
import type { CreateCategoryInput, UpdateCategoryInput } from "../types/Category";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService = new CategoryService()) {}

  create = (req: Request, res: Response): void => {
    const { name, description } = req.body as Partial<CreateCategoryInput>;

    if (!name || typeof name !== "string") {
      throw new AppError(400, "name is required");
    }

    if (description !== undefined && typeof description !== "string") {
      throw new AppError(400, "description must be a string");
    }

    const category = this.categoryService.create({ name, description });
    res.status(201).json(category);
  };

  list = (_req: Request, res: Response): void => {
    res.json(this.categoryService.getAll());
  };

  getById = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid category id");
    }

    res.json(this.categoryService.getById(id));
  };

  update = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid category id");
    }

    const body = req.body as UpdateCategoryInput;

    if (body.name !== undefined && typeof body.name !== "string") {
      throw new AppError(400, "name must be a string");
    }

    if (body.description !== undefined && typeof body.description !== "string") {
      throw new AppError(400, "description must be a string");
    }

    res.json(this.categoryService.update(id, body));
  };

  delete = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid category id");
    }

    this.categoryService.delete(id);
    res.status(204).send();
  };
}
