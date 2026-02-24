import type BetterSqlite3 from "better-sqlite3";

import { db } from "../db/sqlite";
import type { CategoryRow } from "../types/DatabaseRows";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../types/Category";

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class CategoryRepository {
  constructor(private readonly connection: BetterSqlite3.Database = db) {}

  create(input: CreateCategoryInput): Category {
    const result = this.connection
      .prepare(
        `
        INSERT INTO categories (name, description)
        VALUES (?, ?)
      `
      )
      .run(input.name, input.description ?? null);

    return this.findById(Number(result.lastInsertRowid)) as Category;
  }

  findAll(): Category[] {
    const rows = this.connection
      .prepare(
        `
        SELECT id, name, description, created_at, updated_at
        FROM categories
        ORDER BY id DESC
      `
      )
      .all() as CategoryRow[];

    return rows.map(toCategory);
  }

  findById(id: number): Category | null {
    const row = this.connection
      .prepare(
        `
        SELECT id, name, description, created_at, updated_at
        FROM categories
        WHERE id = ?
      `
      )
      .get(id) as CategoryRow | undefined;

    if (!row) {
      return null;
    }

    return toCategory(row);
  }

  update(id: number, input: UpdateCategoryInput): Category | null {
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

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    this.connection
      .prepare(
        `
        UPDATE categories
        SET ${updates.join(", ")}
        WHERE id = ?
      `
      )
      .run(...values);

    return this.findById(id);
  }

  delete(id: number): boolean {
    const result = this.connection.prepare("DELETE FROM categories WHERE id = ?").run(id);
    return result.changes > 0;
  }
}
