<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    private function toUser(User $row): array
    {
        return [
            'id' => $row->id,
            'name' => $row->name,
            'email' => $row->email,
            'createdAt' => $row->created_at,
            'updatedAt' => $row->updated_at,
        ];
    }

    public function create(array $input): array
    {
        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
        ]);

        return $this->findById($user->id);
    }

    public function findAll(): array
    {
        return User::orderBy('id', 'desc')->get()
            ->map(fn (User $row) => $this->toUser($row))
            ->all();
    }

    public function findById(int $id): ?array
    {
        $row = User::find($id);

        return $row ? $this->toUser($row) : null;
    }

    public function update(int $id, array $input): ?array
    {
        $row = User::find($id);
        if (! $row) {
            return null;
        }

        if (array_key_exists('name', $input)) {
            $row->name = $input['name'];
        }
        if (array_key_exists('email', $input)) {
            $row->email = $input['email'];
        }

        $row->save();

        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        return User::where('id', $id)->delete() > 0;
    }
}
