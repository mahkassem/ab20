import { ProductRepository } from "../repositories/ProductRepository";
import { AppError } from "../app/AppError";
import type { CreateProductInput, Product, UpdateProductInput } from "../types/Product";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository = new ProductRepository()) {}

  create(input: CreateProductInput): Product {
    return this.productRepository.create(input);
  }

  getAll(): Product[] {
    return this.productRepository.findAll();
  }

  getById(id: number): Product {
    const product = this.productRepository.findById(id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    return product;
  }

  update(id: number, input: UpdateProductInput): Product {
    const existing = this.productRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "Product not found");
    }

    const product = this.productRepository.update(id, input);
    return product as Product;
  }

  delete(id: number): void {
    const removed = this.productRepository.delete(id);
    if (!removed) {
      throw new AppError(404, "Product not found");
    }
  }
}
