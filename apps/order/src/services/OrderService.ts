import { db } from "../db/sqlite";
import { OrderRepository } from "../repositories/OrderRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../app/AppError";
import type { CreateOrderInput, OrderWithLines } from "../types/Order";
import type { User } from "../types/User";

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository = new OrderRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly productRepository: ProductRepository = new ProductRepository()
  ) {}

  create(input: CreateOrderInput): OrderWithLines {
    const transaction = db.transaction((payload: CreateOrderInput) => {
      const user = this.resolveUser(payload);

      const resolvedLines = payload.lines.map((line) => {
        const product = this.productRepository.findById(line.productId);
        if (!product) {
          throw new AppError(404, `Product ${line.productId} not found`);
        }

        if (product.inventoryCount < line.quantity) {
          throw new AppError(409, `Insufficient inventory for product ${line.productId}`);
        }

        return {
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: product.price,
          lineTotal: product.price * line.quantity
        };
      });

      const totalAmount = resolvedLines.reduce((sum, line) => sum + line.lineTotal, 0);
      const orderId = this.orderRepository.createOrder(user.id, payload.notes, totalAmount);

      for (const line of resolvedLines) {
        const inventoryUpdated = this.productRepository.decrementInventoryIfAvailable(line.productId, line.quantity);
        if (!inventoryUpdated) {
          throw new AppError(409, `Insufficient inventory for product ${line.productId}`);
        }

        this.orderRepository.createOrderLine(orderId, line.productId, line.quantity, line.unitPrice);
      }

      const order = this.orderRepository.findByIdWithLines(orderId);
      if (!order) {
        throw new AppError(500, "Failed to create order");
      }

      return order;
    });

    return transaction(input);
  }

  getAll(): OrderWithLines[] {
    return this.orderRepository.findAllWithLines();
  }

  getById(orderId: number): OrderWithLines {
    const order = this.orderRepository.findByIdWithLines(orderId);
    if (!order) {
      throw new AppError(404, "Order not found");
    }

    return order;
  }

  deleteAll(): void {
    this.orderRepository.deleteAll();
  }

  private resolveUser(input: CreateOrderInput): User {
    if (input.user.id) {
      const existing = this.userRepository.findById(input.user.id);
      if (!existing) {
        throw new AppError(404, "User not found");
      }

      return existing;
    }

    if (!input.user.email || !input.user.name) {
      throw new AppError(400, "Either user.id or user.name and user.email are required");
    }

    const byEmail = this.userRepository.findByEmail(input.user.email);
    if (byEmail) {
      return byEmail;
    }

    return this.userRepository.create({
      name: input.user.name,
      email: input.user.email
    });
  }
}
