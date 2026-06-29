<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        private readonly OrderRepository $orderRepository,
        private readonly UserRepository $userRepository,
        private readonly ProductRepository $productRepository,
    ) {}

    public function create(array $input): array
    {
        return DB::transaction(function () use ($input) {
            $user = $this->resolveUser($input);

            $resolvedLines = array_map(function (array $line) {
                $product = $this->productRepository->findById($line['productId']);
                if (! $product) {
                    throw new AppException(404, "Product {$line['productId']} not found");
                }

                if ($product['inventoryCount'] < $line['quantity']) {
                    throw new AppException(409, "Insufficient inventory for product {$line['productId']}");
                }

                return [
                    'productId' => $line['productId'],
                    'quantity' => $line['quantity'],
                    'unitPrice' => $product['price'],
                    'lineTotal' => $product['price'] * $line['quantity'],
                ];
            }, $input['lines']);

            $totalAmount = array_sum(array_column($resolvedLines, 'lineTotal'));
            $orderId = $this->orderRepository->createOrder($user['id'], $input['notes'] ?? null, $totalAmount);

            foreach ($resolvedLines as $line) {
                $inventoryUpdated = $this->productRepository->decrementInventoryIfAvailable($line['productId'], $line['quantity']);
                if (! $inventoryUpdated) {
                    throw new AppException(409, "Insufficient inventory for product {$line['productId']}");
                }

                $this->orderRepository->createOrderLine($orderId, $line['productId'], $line['quantity'], $line['unitPrice']);
            }

            $order = $this->orderRepository->findByIdWithLines($orderId);
            if (! $order) {
                throw new AppException(500, 'Failed to create order');
            }

            return $order;
        });
    }

    public function getAll(): array
    {
        return $this->orderRepository->findAllWithLines();
    }

    public function getById(int $orderId): array
    {
        $order = $this->orderRepository->findByIdWithLines($orderId);
        if (! $order) {
            throw new AppException(404, 'Order not found');
        }

        return $order;
    }

    public function deleteAll(): void
    {
        $this->orderRepository->deleteAll();
    }

    private function resolveUser(array $input): array
    {
        $user = $input['user'];

        if (! empty($user['id'])) {
            $existing = $this->userRepository->findById($user['id']);
            if (! $existing) {
                throw new AppException(404, 'User not found');
            }

            return $existing;
        }

        if (empty($user['email']) || empty($user['name'])) {
            throw new AppException(400, 'Either user.id or user.name and user.email are required');
        }

        $byEmail = $this->userRepository->findByEmail($user['email']);
        if ($byEmail) {
            return $byEmail;
        }

        return $this->userRepository->create([
            'name' => $user['name'],
            'email' => $user['email'],
        ]);
    }
}
