<?php

namespace App\Http\Controllers;

use App\Exceptions\AppException;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private readonly ProductService $productService) {}

    public function create(Request $request)
    {
        $name = $request->input('name');
        $description = $request->input('description');
        $price = $request->input('price');
        $inventoryCount = $request->input('inventoryCount');

        if (! $name || ! is_string($name)) {
            throw new AppException(400, 'name is required');
        }

        if (! is_numeric($price) || is_string($price) || $price < 0) {
            throw new AppException(400, 'price must be a non-negative number');
        }

        if (! is_int($inventoryCount) || $inventoryCount < 0) {
            throw new AppException(400, 'inventoryCount must be a non-negative integer');
        }

        $product = $this->productService->create([
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'inventoryCount' => $inventoryCount,
        ]);

        return response()->json($product, 201);
    }

    public function list()
    {
        return response()->json($this->productService->getAll());
    }

    public function getById(string $id)
    {
        $intId = $this->parseId($id);

        return response()->json($this->productService->getById($intId));
    }

    public function update(Request $request, string $id)
    {
        $intId = $this->parseId($id);

        $body = $request->all();

        if (array_key_exists('name', $body) && ! is_string($body['name'])) {
            throw new AppException(400, 'name must be a string');
        }

        if (array_key_exists('description', $body) && ! is_string($body['description'])) {
            throw new AppException(400, 'description must be a string');
        }

        if (array_key_exists('price', $body) && (! is_numeric($body['price']) || is_string($body['price']) || $body['price'] < 0)) {
            throw new AppException(400, 'price must be a non-negative number');
        }

        if (array_key_exists('inventoryCount', $body) && (! is_int($body['inventoryCount']) || $body['inventoryCount'] < 0)) {
            throw new AppException(400, 'inventoryCount must be a non-negative integer');
        }

        return response()->json($this->productService->update($intId, $body));
    }

    public function delete(string $id)
    {
        $intId = $this->parseId($id);

        $this->productService->delete($intId);

        return response()->noContent();
    }

    private function parseId(string $id): int
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid product id');
        }

        return (int) $id;
    }
}
