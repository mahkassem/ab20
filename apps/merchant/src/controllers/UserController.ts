import type { Request, Response } from "express";

import { AppError } from "../app/AppError";
import { UserService } from "../services/UserService";
import type { CreateUserInput, UpdateUserInput } from "../types/User";

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  async create(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body as Partial<CreateUserInput>;

    if (!name || typeof name !== "string") {
      throw new AppError(400, "name is required");
    }

    if (!password || typeof password !== "string") {
      throw new AppError(400, "password is required");
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw new AppError(400, "valid email is required");
    }

    const user = await this.userService.create({ name, email, password });
    res.status(201).json(user);
  };

  list = (_req: Request, res: Response): void => {
    res.json(this.userService.getAll());
  };

  getById = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid user id");
    }

    res.json(this.userService.getById(id));
  };

  update = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid user id");
    }

    const body = req.body as UpdateUserInput;

    if (body.name !== undefined && typeof body.name !== "string") {
      throw new AppError(400, "name must be a string");
    }

    if (body.email !== undefined && (typeof body.email !== "string" || !body.email.includes("@"))) {
      throw new AppError(400, "email must be valid");
    }

    res.json(this.userService.update(id, body));
  };

  delete = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid user id");
    }

    this.userService.delete(id);
    res.status(204).send();
  };
}
