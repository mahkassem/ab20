import type { Request, Response } from "express";

import { OrderService } from "../services/OrderService";
import { AppError } from "../app/AppError";
import type { CreateOrderInput } from "../types/Order";

export class OrderController {
  constructor(private readonly orderService: OrderService = new OrderService()) {}

  create = (req: Request, res: Response): void => {
    console.log("Received order creation request with body:", new Date().toISOString());
    const body = req.body as Partial<CreateOrderInput>;

    if (!body.user || typeof body.user !== "object") {
      throw new AppError(400, "user is required");
    }

    if (!Array.isArray(body.lines) || body.lines.length === 0) {
      throw new AppError(400, "lines must be a non-empty array");
    }

    for (const line of body.lines) {
      if (
        typeof line.productId !== "number" ||
        !Number.isInteger(line.productId) ||
        line.productId <= 0
      ) {
        throw new AppError(400, "line.productId must be a positive integer");
      }

      if (typeof line.quantity !== "number" || !Number.isInteger(line.quantity) || line.quantity <= 0) {
        throw new AppError(400, "line.quantity must be a positive integer");
      }
    }

    if (body.notes !== undefined && typeof body.notes !== "string") {
      throw new AppError(400, "notes must be a string");
    }

    const order = this.orderService.create(body as CreateOrderInput);
    
    console.log("Created order:", order.id);

    res.status(201).json(order);
  };

  list = (_req: Request, res: Response): void => {
    res.json(this.orderService.getAll());
  };

  getById = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "Invalid order id");
    }

    res.json(this.orderService.getById(id));
  };

  deleteAll = (_req: Request, res: Response): void => {
    this.orderService.deleteAll();
    res.status(204).send();
  };
}
