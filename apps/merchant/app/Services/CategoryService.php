<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Repositories\CategoryRepository;
use Throwable;

class CategoryService
{
    public function __construct(private readonly CategoryRepository $categoryRepository)
    {
    }

    private function isUniqueConstraintError(Throwable $error): bool
    {
        return str_contains($error->getMessage(), 'UNIQUE constraint failed');
    }

    public function create(array $input): array
    {
        try {
            return $this->categoryRepository->create($input);
        } catch (Throwable $error) {
            if ($this->isUniqueConstraintError($error)) {
                throw new AppException(409, 'Category name already exists');
            }

            throw $error;
        }
    }

    public function getAll(): array
    {
        return $this->categoryRepository->findAll();
    }

    public function getById(int $id): array
    {
        $category = $this->categoryRepository->findById($id);
        if (! $category) {
            throw new AppException(404, 'Category not found');
        }

        return $category;
    }

    public function update(int $id, array $input): array
    {
        $existing = $this->categoryRepository->findById($id);
        if (! $existing) {
            throw new AppException(404, 'Category not found');
        }

        try {
            return $this->categoryRepository->update($id, $input);
        } catch (Throwable $error) {
            if ($this->isUniqueConstraintError($error)) {
                throw new AppException(409, 'Category name already exists');
            }

            throw $error;
        }
    }

    public function delete(int $id): void
    {
        $removed = $this->categoryRepository->delete($id);
        if (! $removed) {
            throw new AppException(404, 'Category not found');
        }
    }
}
