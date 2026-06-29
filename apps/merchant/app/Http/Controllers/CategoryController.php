<?php

namespace App\Http\Controllers;

use App\Exceptions\AppException;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private readonly CategoryService $categoryService)
    {
    }

    public function create(Request $request)
    {
        $name = $request->input('name');
        $description = $request->input('description');

        if (! $name || ! is_string($name)) {
            throw new AppException(400, 'name is required');
        }

        if ($request->has('description') && ! is_string($description)) {
            throw new AppException(400, 'description must be a string');
        }

        $category = $this->categoryService->create([
            'name' => $name,
            'description' => $description,
        ]);

        return response()->json($category, 201);
    }

    public function list()
    {
        return response()->json($this->categoryService->getAll());
    }

    public function getById(string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid category id');
        }

        return response()->json($this->categoryService->getById((int) $id));
    }

    public function update(Request $request, string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid category id');
        }

        if ($request->has('name') && ! is_string($request->input('name'))) {
            throw new AppException(400, 'name must be a string');
        }

        if ($request->has('description') && ! is_string($request->input('description'))) {
            throw new AppException(400, 'description must be a string');
        }

        $body = $request->only(['name', 'description']);

        return response()->json($this->categoryService->update((int) $id, $body));
    }

    public function delete(string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid category id');
        }

        $this->categoryService->delete((int) $id);

        return response()->noContent();
    }
}
