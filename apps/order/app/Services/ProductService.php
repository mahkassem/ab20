<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Repositories\ProductRepository;

class ProductService
{
    public function __construct(private readonly ProductRepository $productRepository) {}

    public function create(array $input): array
    {
        return $this->productRepository->create($input);
    }

    public function getAll(): array
    {
        return $this->productRepository->findAll();
    }

    public function getById(int $id): array
    {
        $product = $this->productRepository->findById($id);
        if (! $product) {
            throw new AppException(404, 'Product not found');
        }

        return $product;
    }

    public function update(int $id, array $input): array
    {
        $existing = $this->productRepository->findById($id);
        if (! $existing) {
            throw new AppException(404, 'Product not found');
        }

        return $this->productRepository->update($id, $input);
    }

    public function delete(int $id): void
    {
        $removed = $this->productRepository->delete($id);
        if (! $removed) {
            throw new AppException(404, 'Product not found');
        }
    }
}
