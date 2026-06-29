<?php

namespace App\Repositories;

use App\Models\Store;

class StoreRepository
{
    private function toStore(Store $row): array
    {
        return [
            'id' => $row->id,
            'name' => $row->name,
            'description' => $row->description,
            'ownerUserId' => $row->owner_user_id,
            'categoryId' => $row->category_id,
            'createdAt' => $row->created_at,
            'updatedAt' => $row->updated_at,
        ];
    }

    public function create(array $input): array
    {
        $store = Store::create([
            'name' => $input['name'],
            'description' => $input['description'] ?? null,
            'owner_user_id' => $input['ownerUserId'],
            'category_id' => $input['categoryId'] ?? null,
        ]);

        return $this->findById($store->id);
    }

    public function findAll(): array
    {
        return Store::orderBy('id', 'desc')->get()
            ->map(fn (Store $row) => $this->toStore($row))
            ->all();
    }

    public function findById(int $id): ?array
    {
        $row = Store::find($id);

        return $row ? $this->toStore($row) : null;
    }

    public function update(int $id, array $input): ?array
    {
        $row = Store::find($id);
        if (! $row) {
            return null;
        }

        if (array_key_exists('name', $input)) {
            $row->name = $input['name'];
        }
        if (array_key_exists('description', $input)) {
            $row->description = $input['description'];
        }
        if (array_key_exists('ownerUserId', $input)) {
            $row->owner_user_id = $input['ownerUserId'];
        }
        if (array_key_exists('categoryId', $input)) {
            $row->category_id = $input['categoryId'];
        }

        $row->save();

        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        return Store::where('id', $id)->delete() > 0;
    }
}
