import { AppError } from "../app/AppError";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { StoreRepository } from "../repositories/StoreRepository";
import { UserRepository } from "../repositories/UserRepository";
import type { CreateStoreInput, Store, UpdateStoreInput } from "../types/Store";

function isForeignKeyConstraintError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("FOREIGN KEY constraint failed");
}

export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository = new StoreRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly categoryRepository: CategoryRepository = new CategoryRepository()
  ) {}

  create(input: CreateStoreInput): Store {
    const owner = this.userRepository.findById(input.ownerUserId);
    if (!owner) {
      throw new AppError(404, "Owner user not found");
    }

    if (input.categoryId !== undefined) {
      const category = this.categoryRepository.findById(input.categoryId);
      if (!category) {
        throw new AppError(404, "Category not found");
      }
    }

    try {
      return this.storeRepository.create(input);
    } catch (error) {
      if (isForeignKeyConstraintError(error)) {
        throw new AppError(409, "Invalid store references");
      }

      throw error;
    }
  }

  getAll(): Store[] {
    return this.storeRepository.findAll();
  }

  getById(id: number): Store {
    const store = this.storeRepository.findById(id);
    if (!store) {
      throw new AppError(404, "Store not found");
    }

    return store;
  }

  update(id: number, input: UpdateStoreInput): Store {
    const existing = this.storeRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "Store not found");
    }

    if (input.ownerUserId !== undefined) {
      const owner = this.userRepository.findById(input.ownerUserId);
      if (!owner) {
        throw new AppError(404, "Owner user not found");
      }
    }

    if (input.categoryId !== undefined && input.categoryId !== null) {
      const category = this.categoryRepository.findById(input.categoryId);
      if (!category) {
        throw new AppError(404, "Category not found");
      }
    }

    try {
      const store = this.storeRepository.update(id, input);
      return store as Store;
    } catch (error) {
      if (isForeignKeyConstraintError(error)) {
        throw new AppError(409, "Invalid store references");
      }

      throw error;
    }
  }

  delete(id: number): void {
    const removed = this.storeRepository.delete(id);
    if (!removed) {
      throw new AppError(404, "Store not found");
    }
  }
}
