import type BetterSqlite3 from "better-sqlite3";

import { db } from "../db/sqlite";
import type { ProductRow } from "../types/DatabaseRows";
import type { CreateProductInput, Product, UpdateProductInput } from "../types/Product";

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    inventoryCount: row.inventory_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class ProductRepository {
  constructor(private readonly connection: BetterSqlite3.Database = db) {}

  create(input: CreateProductInput): Product {
    const result = this.connection
      .prepare(
        `
        INSERT INTO products (name, description, price, inventory_count)
        VALUES (?, ?, ?, ?)
      `
      )
      .run(input.name, input.description ?? null, input.price, input.inventoryCount);

    return this.findById(Number(result.lastInsertRowid)) as Product;
  }

  findAll(): Product[] {
    const rows = this.connection
      .prepare(
        `
        SELECT id, name, description, price, inventory_count, created_at, updated_at
        FROM products
        ORDER BY id DESC
      `
      )
      .all() as ProductRow[];

    return rows.map(toProduct);
  }

  findById(id: number): Product | null {
    const row = this.connection
      .prepare(
        `
        SELECT id, name, description, price, inventory_count, created_at, updated_at
        FROM products
        WHERE id = ?
      `
      )
      .get(id) as ProductRow | undefined;

    if (!row) {
      return null;
    }

    return toProduct(row);
  }

  update(id: number, input: UpdateProductInput): Product | null {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      updates.push("name = ?");
      values.push(input.name);
    }

    if (input.description !== undefined) {
      updates.push("description = ?");
      values.push(input.description);
    }

    if (input.price !== undefined) {
      updates.push("price = ?");
      values.push(input.price);
    }

    if (input.inventoryCount !== undefined) {
      updates.push("inventory_count = ?");
      values.push(input.inventoryCount);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    this.connection
      .prepare(
        `
        UPDATE products
        SET ${updates.join(", ")}
        WHERE id = ?
      `
      )
      .run(...values);

    return this.findById(id);
  }

  delete(id: number): boolean {
    const result = this.connection.prepare("DELETE FROM products WHERE id = ?").run(id);
    return result.changes > 0;
  }

  decrementInventoryIfAvailable(productId: number, quantity: number): boolean {
    const result = this.connection
      .prepare(
        `
        UPDATE products
        SET inventory_count = inventory_count - ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      )
      .run(quantity, productId);

    return result.changes > 0;
  }
}
