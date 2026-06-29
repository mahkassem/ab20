<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository
{
    private function toCategory(Category $row): array
    {
        return [
            'id' => $row->id,
            'name' => $row->name,
            'description' => $row->description,
            'createdAt' => $row->created_at,
            'updatedAt' => $row->updated_at,
        ];
    }

    public function create(array $input): array
    {
        $category = Category::create([
            'name' => $input['name'],
            'description' => $input['description'] ?? null,
        ]);

        return $this->findById($category->id);
    }

    public function findAll(): array
    {
        return Category::orderBy('id', 'desc')->get()
            ->map(fn (Category $row) => $this->toCategory($row))
            ->all();
    }

    public function findById(int $id): ?array
    {
        $row = Category::find($id);

        return $row ? $this->toCategory($row) : null;
    }

    public function update(int $id, array $input): ?array
    {
        $row = Category::find($id);
        if (! $row) {
            return null;
        }

        if (array_key_exists('name', $input)) {
            $row->name = $input['name'];
        }
        if (array_key_exists('description', $input)) {
            $row->description = $input['description'];
        }

        $row->save();

        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        return Category::where('id', $id)->delete() > 0;
    }
}
