import type BetterSqlite3 from "better-sqlite3";

import { db } from "../db/sqlite";
import type { UserRow } from "../types/DatabaseRows";
import type { CreateUserInput, UpdateUserInput, User } from "../types/User";

function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class UserRepository {
  constructor(private readonly connection: BetterSqlite3.Database = db) {}

  create(input: CreateUserInput): User {
    const result = this.connection
      .prepare(
        `
        INSERT INTO users (name, email, password)
        VALUES (?, ?)
      `
      )
      .run(input.name, input.email);

    return this.findById(Number(result.lastInsertRowid)) as User;
  }

  findAll(): User[] {
    const rows = this.connection
      .prepare(
        `
        SELECT id, name, email, created_at, updated_at
        FROM users
        ORDER BY id DESC
      `
      )
      .all() as UserRow[];

    return rows.map(toUser);
  }

  findById(id: number): User | null {
    const row = this.connection
      .prepare(
        `
        SELECT id, name, email, password, created_at, updated_at
        FROM users
        WHERE id = ?
      `
      )
      .get(id) as UserRow | undefined;

    if (!row) {
      return null;
    }

    return toUser(row);
  }

  findByEmail(email: string): User | null {
    const row = this.connection
      .prepare(
        `
        SELECT id, name, email, password, created_at, updated_at
        FROM users
        WHERE email = ?
      `
      )
      .get(email) as UserRow | undefined;

    if (!row) {
      return null;
    }

    return toUser(row);
  }

  update(id: number, input: UpdateUserInput): User | null {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      updates.push("name = ?");
      values.push(input.name);
    }

    if (input.email !== undefined) {
      updates.push("email = ?");
      values.push(input.email);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    this.connection
      .prepare(
        `
        UPDATE users
        SET ${updates.join(", ")}
        WHERE id = ?
      `
      )
      .run(...values);

    return this.findById(id);
  }

  delete(id: number): boolean {
    const result = this.connection.prepare("DELETE FROM users WHERE id = ?").run(id);
    return result.changes > 0;
  }
}
