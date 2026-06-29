<?php

namespace App\Http\Controllers;

use App\Exceptions\AppException;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    public function create(Request $request)
    {
        $body = $request->all();

        $user = $body['user'] ?? null;
        if (! $user || ! is_array($user)) {
            throw new AppException(400, 'user is required');
        }

        $lines = $body['lines'] ?? null;
        if (! is_array($lines) || count($lines) === 0 || array_is_list($lines) === false) {
            throw new AppException(400, 'lines must be a non-empty array');
        }

        foreach ($lines as $line) {
            $productId = is_array($line) ? ($line['productId'] ?? null) : null;
            if (! is_int($productId) || $productId <= 0) {
                throw new AppException(400, 'line.productId must be a positive integer');
            }

            $quantity = $line['quantity'] ?? null;
            if (! is_int($quantity) || $quantity <= 0) {
                throw new AppException(400, 'line.quantity must be a positive integer');
            }
        }

        if (array_key_exists('notes', $body) && ! is_string($body['notes'])) {
            throw new AppException(400, 'notes must be a string');
        }

        $order = $this->orderService->create($body);

        return response()->json($order, 201);
    }

    public function list()
    {
        return response()->json($this->orderService->getAll());
    }

    public function getById(string $id)
    {
        if (! ctype_digit($id) || (int) $id <= 0) {
            throw new AppException(400, 'Invalid order id');
        }

        return response()->json($this->orderService->getById((int) $id));
    }

    public function deleteAll()
    {
        $this->orderService->deleteAll();

        return response()->noContent();
    }
}
