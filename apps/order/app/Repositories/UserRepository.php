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

        return $this->toUser($user);
    }

    public function findAll(): array
    {
        return User::orderBy('id', 'desc')->get()
            ->map(fn (User $u) => $this->toUser($u))->all();
    }

    public function findById(int $id): ?array
    {
        $user = User::find($id);

        return $user ? $this->toUser($user) : null;
    }

    public function findByEmail(string $email): ?array
    {
        $user = User::where('email', $email)->first();

        return $user ? $this->toUser($user) : null;
    }

    public function update(int $id, array $input): ?array
    {
        $user = User::find($id);
        if (! $user) {
            return null;
        }

        if (array_key_exists('name', $input)) {
            $user->name = $input['name'];
        }
        if (array_key_exists('email', $input)) {
            $user->email = $input['email'];
        }

        $user->save();

        return $this->toUser($user);
    }

    public function delete(int $id): bool
    {
        return User::destroy($id) > 0;
    }
}
