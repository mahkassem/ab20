import { AppError } from "../app/AppError";
import { UserRepository } from "../repositories/UserRepository";
import type { CreateUserInput, UpdateUserInput, User } from "../types/User";

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("UNIQUE constraint failed");
}

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  create(input: CreateUserInput): User {
    try {
      return this.userRepository.create(input);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError(409, "User email already exists");
      }

      throw error;
    }
  }

  getAll(): User[] {
    return this.userRepository.findAll();
  }

  getById(id: number): User {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  }

  update(id: number, input: UpdateUserInput): User {
    const existing = this.userRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "User not found");
    }

    try {
      const user = this.userRepository.update(id, input);
      return user as User;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError(409, "User email already exists");
      }

      throw error;
    }
  }

  delete(id: number): void {
    const removed = this.userRepository.delete(id);
    if (!removed) {
      throw new AppError(404, "User not found");
    }
  }
}
