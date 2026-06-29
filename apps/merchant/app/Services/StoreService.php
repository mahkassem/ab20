<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Repositories\CategoryRepository;
use App\Repositories\StoreRepository;
use App\Repositories\UserRepository;
use Throwable;

class StoreService
{
    public function __construct(
        private readonly StoreRepository $storeRepository,
        private readonly UserRepository $userRepository,
        private readonly CategoryRepository $categoryRepository,
    ) {
    }

    private function isForeignKeyConstraintError(Throwable $error): bool
    {
        return str_contains($error->getMessage(), 'FOREIGN KEY constraint failed');
    }

    public function create(array $input): array
    {
        $owner = $this->userRepository->findById($input['ownerUserId']);
        if (! $owner) {
            throw new AppException(404, 'Owner user not found');
        }

        if (array_key_exists('categoryId', $input) && $input['categoryId'] !== null) {
            $category = $this->categoryRepository->findById($input['categoryId']);
            if (! $category) {
                throw new AppException(404, 'Category not found');
            }
        }

        try {
            return $this->storeRepository->create($input);
        } catch (Throwable $error) {
            if ($this->isForeignKeyConstraintError($error)) {
                throw new AppException(409, 'Invalid store references');
            }

            throw $error;
        }
    }

    public function getAll(): array
    {
        return $this->storeRepository->findAll();
    }

    public function getById(int $id): array
    {
        $store = $this->storeRepository->findById($id);
        if (! $store) {
            throw new AppException(404, 'Store not found');
        }

        return $store;
    }

    public function update(int $id, array $input): array
    {
        $existing = $this->storeRepository->findById($id);
        if (! $existing) {
            throw new AppException(404, 'Store not found');
        }

        if (array_key_exists('ownerUserId', $input)) {
            $owner = $this->userRepository->findById($input['ownerUserId']);
            if (! $owner) {
                throw new AppException(404, 'Owner user not found');
            }
        }

        if (array_key_exists('categoryId', $input) && $input['categoryId'] !== null) {
            $category = $this->categoryRepository->findById($input['categoryId']);
            if (! $category) {
                throw new AppException(404, 'Category not found');
            }
        }

        try {
            return $this->storeRepository->update($id, $input);
        } catch (Throwable $error) {
            if ($this->isForeignKeyConstraintError($error)) {
                throw new AppException(409, 'Invalid store references');
            }

            throw $error;
        }
    }

    public function delete(int $id): void
    {
        $removed = $this->storeRepository->delete($id);
        if (! $removed) {
            throw new AppException(404, 'Store not found');
        }
    }
}
