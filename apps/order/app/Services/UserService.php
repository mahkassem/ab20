<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Repositories\UserRepository;
use Illuminate\Database\QueryException;

class UserService
{
    public function __construct(private readonly UserRepository $userRepository) {}

    private function isUniqueConstraintError(QueryException $e): bool
    {
        return str_contains($e->getMessage(), 'UNIQUE constraint failed');
    }

    public function create(array $input): array
    {
        try {
            return $this->userRepository->create($input);
        } catch (QueryException $e) {
            if ($this->isUniqueConstraintError($e)) {
                throw new AppException(409, 'User email already exists');
            }

            throw $e;
        }
    }

    public function getAll(): array
    {
        return $this->userRepository->findAll();
    }

    public function getById(int $id): array
    {
        $user = $this->userRepository->findById($id);
        if (! $user) {
            throw new AppException(404, 'User not found');
        }

        return $user;
    }

    public function update(int $id, array $input): array
    {
        $existing = $this->userRepository->findById($id);
        if (! $existing) {
            throw new AppException(404, 'User not found');
        }

        try {
            return $this->userRepository->update($id, $input);
        } catch (QueryException $e) {
            if ($this->isUniqueConstraintError($e)) {
                throw new AppException(409, 'User email already exists');
            }

            throw $e;
        }
    }

    public function delete(int $id): void
    {
        $removed = $this->userRepository->delete($id);
        if (! $removed) {
            throw new AppException(404, 'User not found');
        }
    }
}
