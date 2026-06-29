<?php

namespace App\Http\Controllers;

use App\Exceptions\AppException;
use App\Services\StoreService;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function __construct(private readonly StoreService $storeService)
    {
    }

    public function create(Request $request)
    {
        $name = $request->input('name');
        $description = $request->input('description');
        $ownerUserId = $request->input('ownerUserId');
        $categoryId = $request->input('categoryId');

        if (! $name || ! is_string($name)) {
            throw new AppException(400, 'name is required');
        }

        if ($request->has('description') && ! is_string($description)) {
            throw new AppException(400, 'description must be a string');
        }

        if (! is_int($ownerUserId) || $ownerUserId <= 0) {
            throw new AppException(400, 'ownerUserId is required');
        }

        if ($request->has('categoryId') && (! is_int($categoryId) || $categoryId <= 0)) {
            throw new AppException(400, 'categoryId must be a positive integer');
        }

        $input = [
            'name' => $name,
            'description' => $description,
            'ownerUserId' => $ownerUserId,
        ];
        if ($request->has('categoryId')) {
            $input['categoryId'] = $categoryId;
        }

        $store = $this->storeService->create($input);

        return response()->json($store, 201);
    }

    public function list()
    {
        return response()->json($this->storeService->getAll());
    }

    public function getById(string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid store id');
        }

        return response()->json($this->storeService->getById((int) $id));
    }

    public function update(Request $request, string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid store id');
        }

        if ($request->has('name') && ! is_string($request->input('name'))) {
            throw new AppException(400, 'name must be a string');
        }

        if ($request->has('description') && ! is_string($request->input('description'))) {
            throw new AppException(400, 'description must be a string');
        }

        if ($request->has('ownerUserId')) {
            $ownerUserId = $request->input('ownerUserId');
            if (! is_int($ownerUserId) || $ownerUserId <= 0) {
                throw new AppException(400, 'ownerUserId must be a positive integer');
            }
        }

        if ($request->has('categoryId')) {
            $categoryId = $request->input('categoryId');
            if ($categoryId !== null && (! is_int($categoryId) || $categoryId <= 0)) {
                throw new AppException(400, 'categoryId must be a positive integer or null');
            }
        }

        $body = $request->only(['name', 'description', 'ownerUserId', 'categoryId']);

        return response()->json($this->storeService->update((int) $id, $body));
    }

    public function delete(string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid store id');
        }

        $this->storeService->delete((int) $id);

        return response()->noContent();
    }
}
