<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\OrderLine;

class OrderRepository
{
    private function toOrder(Order $row): array
    {
        return [
            'id' => $row->id,
            'userId' => $row->user_id,
            'status' => $row->status,
            'notes' => $row->notes,
            'totalAmount' => $row->total_amount,
            'createdAt' => $row->created_at,
        ];
    }

    private function toOrderLine(OrderLine $row): array
    {
        return [
            'id' => $row->id,
            'orderId' => $row->order_id,
            'productId' => $row->product_id,
            'quantity' => $row->quantity,
            'unitPrice' => $row->unit_price,
            'lineTotal' => $row->line_total,
        ];
    }

    public function deleteAll(): void
    {
        OrderLine::query()->delete();
        Order::query()->delete();
    }

    public function createOrder(int $userId, ?string $notes, float $totalAmount): int
    {
        $order = Order::create([
            'user_id' => $userId,
            'notes' => $notes,
            'total_amount' => $totalAmount,
        ]);

        return $order->id;
    }

    public function createOrderLine(int $orderId, int $productId, int $quantity, float $unitPrice): void
    {
        OrderLine::create([
            'order_id' => $orderId,
            'product_id' => $productId,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'line_total' => $unitPrice * $quantity,
        ]);
    }

    public function findByIdWithLines(int $orderId): ?array
    {
        $order = Order::find($orderId);
        if (! $order) {
            return null;
        }

        $lines = OrderLine::where('order_id', $orderId)->orderBy('id')->get()
            ->map(fn (OrderLine $l) => $this->toOrderLine($l))->all();

        return $this->toOrder($order) + ['lines' => $lines];
    }

    public function findAllWithLines(): array
    {
        $orders = Order::orderBy('id', 'desc')->get();
        if ($orders->isEmpty()) {
            return [];
        }

        $grouped = [];
        foreach (OrderLine::orderBy('id')->get() as $line) {
            $item = $this->toOrderLine($line);
            $grouped[$item['orderId']][] = $item;
        }

        return $orders->map(fn (Order $order) => $this->toOrder($order)
            + ['lines' => $grouped[$order->id] ?? []])->all();
    }
}
