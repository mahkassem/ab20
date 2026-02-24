import type BetterSqlite3 from "better-sqlite3";

import { db } from "../db/sqlite";
import type { StoreRow } from "../types/DatabaseRows";
import type { CreateStoreInput, Store, UpdateStoreInput } from "../types/Store";

function toStore(row: StoreRow): Store {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    ownerUserId: row.owner_user_id,
    categoryId: row.category_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class StoreRepository {
  constructor(private readonly connection: BetterSqlite3.Database = db) {}

  create(input: CreateStoreInput): Store {
    const result = this.connection
      .prepare(
        `
        INSERT INTO stores (name, description, owner_user_id, category_id)
        VALUES (?, ?, ?, ?)
      `
      )
      .run(input.name, input.description ?? null, input.ownerUserId, input.categoryId ?? null);

    return this.findById(Number(result.lastInsertRowid)) as Store;
  }

  findAll(): Store[] {
    const rows = this.connection
      .prepare(
        `
        SELECT id, name, description, owner_user_id, category_id, created_at, updated_at
        FROM stores
        ORDER BY id DESC
      `
      )
      .all() as StoreRow[];

    return rows.map(toStore);
  }

  findById(id: number): Store | null {
    const row = this.connection
      .prepare(
        `
        SELECT id, name, description, owner_user_id, category_id, created_at, updated_at
        FROM stores
        WHERE id = ?
      `
      )
      .get(id) as StoreRow | undefined;

    if (!row) {
      return null;
    }

    return toStore(row);
  }

  update(id: number, input: UpdateStoreInput): Store | null {
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

    if (input.ownerUserId !== undefined) {
      updates.push("owner_user_id = ?");
      values.push(input.ownerUserId);
    }

    if (input.categoryId !== undefined) {
      updates.push("category_id = ?");
      values.push(input.categoryId);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    this.connection
      .prepare(
        `
        UPDATE stores
        SET ${updates.join(", ")}
        WHERE id = ?
      `
      )
      .run(...values);

    return this.findById(id);
  }

  delete(id: number): boolean {
    const result = this.connection.prepare("DELETE FROM stores WHERE id = ?").run(id);
    return result.changes > 0;
  }
}
