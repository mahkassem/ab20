<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    private function toProduct(Product $row): array
    {
        return [
            'id' => $row->id,
            'name' => $row->name,
            'description' => $row->description,
            'price' => $row->price,
            'inventoryCount' => $row->inventory_count,
            'createdAt' => $row->created_at,
            'updatedAt' => $row->updated_at,
        ];
    }

    public function create(array $input): array
    {
        $product = Product::create([
            'name' => $input['name'],
            'description' => $input['description'] ?? null,
            'price' => $input['price'],
            'inventory_count' => $input['inventoryCount'],
        ]);

        return $this->toProduct($product);
    }

    public function findAll(): array
    {
        return Product::orderBy('id', 'desc')->get()
            ->map(fn (Product $p) => $this->toProduct($p))->all();
    }

    public function findById(int $id): ?array
    {
        $product = Product::find($id);

        return $product ? $this->toProduct($product) : null;
    }

    public function update(int $id, array $input): ?array
    {
        $product = Product::find($id);
        if (! $product) {
            return null;
        }

        if (array_key_exists('name', $input)) {
            $product->name = $input['name'];
        }
        if (array_key_exists('description', $input)) {
            $product->description = $input['description'];
        }
        if (array_key_exists('price', $input)) {
            $product->price = $input['price'];
        }
        if (array_key_exists('inventoryCount', $input)) {
            $product->inventory_count = $input['inventoryCount'];
        }

        $product->save();

        return $this->toProduct($product);
    }

    public function delete(int $id): bool
    {
        return Product::destroy($id) > 0;
    }

    public function decrementInventoryIfAvailable(int $productId, int $quantity): bool
    {
        return Product::where('id', $productId)
            ->update([
                'inventory_count' => \DB::raw("inventory_count - {$quantity}"),
                'updated_at' => now(),
            ]) > 0;
    }
}
