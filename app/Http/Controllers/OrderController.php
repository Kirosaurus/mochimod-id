<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => [
                'required',
                'integer',
                'distinct',
                'exists:products,id',
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', 'in:cash,qris'],
        ]);

        $order = DB::transaction(function () use ($data, $request): Order {
            $requestedItems = collect($data['items'])->keyBy('product_id');
            $products = Product::query()
                ->whereIn('id', $requestedItems->keys())
                ->where('is_active', true)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($products->count() !== $requestedItems->count()) {
                throw ValidationException::withMessages([
                    'items' => 'Ada produk yang tidak tersedia.',
                ]);
            }

            $subtotal = 0;
            $lineItems = [];

            foreach ($requestedItems as $productId => $item) {
                $product = $products->get($productId);
                $quantity = (int) $item['quantity'];

                if ($product->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Stok {$product->name} tidak mencukupi.",
                    ]);
                }

                $lineSubtotal = (float) $product->price * $quantity;
                $subtotal += $lineSubtotal;
                $lineItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'subtotal' => $lineSubtotal,
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'paid',
                'payment_method' => $data['payment_method'],
                'subtotal' => $subtotal,
                'total' => $subtotal,
            ]);

            foreach ($lineItems as $lineItem) {
                $product = $lineItem['product'];
                $product->decrement('stock', $lineItem['quantity']);

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $lineItem['quantity'],
                    'subtotal' => $lineItem['subtotal'],
                ]);
            }

            return $order;
        });

        return redirect()->route('orders.receipt', [
            'order' => $order,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        return Inertia::render('order-receipt', [
            'order' => $order->load('items'),
        ]);
    }

    public function cancel(
        Request $request,
        Order $order
    ): RedirectResponse {
        abort_unless($order->user_id === $request->user()->id, 403);

        if ($order->status !== 'pending') {
            throw ValidationException::withMessages([
                'order' => 'Order ini tidak dapat dibatalkan.',
            ]);
        }

        $order->update(['status' => 'cancelled']);

        return back()->with('success', 'Checkout berhasil dibatalkan.');
    }
}
