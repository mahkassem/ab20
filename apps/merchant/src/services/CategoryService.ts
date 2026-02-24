import { AppError } from "../app/AppError";
import { CategoryRepository } from "../repositories/CategoryRepository";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../types/Category";

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("UNIQUE constraint failed");
}

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository = new CategoryRepository()) {}

  create(input: CreateCategoryInput): Category {
    try {
      return this.categoryRepository.create(input);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError(409, "Category name already exists");
      }

      throw error;
    }
  }

  getAll(): Category[] {
    return this.categoryRepository.findAll();
  }

  getById(id: number): Category {
    const category = this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError(404, "Category not found");
    }

    return category;
  }

  update(id: number, input: UpdateCategoryInput): Category {
    const existing = this.categoryRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "Category not found");
    }

    try {
      const category = this.categoryRepository.update(id, input);
      return category as Category;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError(409, "Category name already exists");
      }

      throw error;
    }
  }

  delete(id: number): void {
    const removed = this.categoryRepository.delete(id);
    if (!removed) {
      throw new AppError(404, "Category not found");
    }
  }
}
