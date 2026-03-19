import type BetterSqlite3 from "better-sqlite3";

import { db } from "../db/sqlite";
import type { OrderLineRow, OrderRow } from "../types/DatabaseRows";
import type { Order, OrderLine, OrderWithLines } from "../types/Order";

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    notes: row.notes,
    totalAmount: row.total_amount,
    createdAt: row.created_at
  };
}

function toOrderLine(row: OrderLineRow): OrderLine {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    lineTotal: row.line_total
  };
}

export class OrderRepository {
  constructor(private readonly connection: BetterSqlite3.Database = db) {}

  deleteAll(): void {
    const transaction = this.connection.transaction(() => {
      this.connection
        .prepare(
          `
          DELETE FROM order_lines
        `
        )
        .run();

      this.connection
        .prepare(
          `
          DELETE FROM orders
        `
        )
        .run();
    });

    transaction();
  }

  createOrder(userId: number, notes: string | undefined, totalAmount: number): number {
    const result = this.connection
      .prepare(
        `
        INSERT INTO orders (user_id, notes, total_amount)
        VALUES (?, ?, ?)
      `
      )
      .run(userId, notes ?? null, totalAmount);

    return Number(result.lastInsertRowid);
  }

  createOrderLine(orderId: number, productId: number, quantity: number, unitPrice: number): void {
    this.connection
      .prepare(
        `
        INSERT INTO order_lines (order_id, product_id, quantity, unit_price, line_total)
        VALUES (?, ?, ?, ?, ?)
      `
      )
      .run(orderId, productId, quantity, unitPrice, unitPrice * quantity);
  }

  findByIdWithLines(orderId: number): OrderWithLines | null {
    const orderRow = this.connection
      .prepare(
        `
        SELECT id, user_id, status, notes, total_amount, created_at
        FROM orders
        WHERE id = ?
      `
      )
      .get(orderId) as OrderRow | undefined;

    if (!orderRow) {
      return null;
    }

    const lineRows = this.connection
      .prepare(
        `
        SELECT id, order_id, product_id, quantity, unit_price, line_total
        FROM order_lines
        WHERE order_id = ?
        ORDER BY id ASC
      `
      )
      .all(orderId) as OrderLineRow[];

    return {
      ...toOrder(orderRow),
      lines: lineRows.map(toOrderLine)
    };
  }

  findAllWithLines(): OrderWithLines[] {
    const orders = this.connection
      .prepare(
        `
        SELECT id, user_id, status, notes, total_amount, created_at
        FROM orders
        ORDER BY id DESC
      `
      )
      .all() as OrderRow[];

    if (orders.length === 0) {
      return [];
    }

    const lineRows = this.connection
      .prepare(
        `
        SELECT id, order_id, product_id, quantity, unit_price, line_total
        FROM order_lines
        ORDER BY id ASC
      `
      )
      .all() as OrderLineRow[];

    const grouped = new Map<number, OrderLine[]>();
    for (const row of lineRows) {
      const item = toOrderLine(row);
      const current = grouped.get(item.orderId) ?? [];
      current.push(item);
      grouped.set(item.orderId, current);
    }

    return orders.map((orderRow) => ({
      ...toOrder(orderRow),
      lines: grouped.get(orderRow.id) ?? []
    }));
  }
}
