<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Product;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Barryvdh\DomPDF\PDF;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function confirm(CheckoutRequest $request)
    {
        $validated = $request->validated();

        // Ambil semua product_id dari request
        $productIds = array_column($validated['items'], 'product_id');

        // Ambil data produk berdasarkan ID yang dikirim
        $products = Product::whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        // Cek setiap item yang dibeli
        $totalAmount = 0;

        foreach ($validated['items'] as $item) {
            $product = $products->get($item['product_id']);

            // Cek ketersediaan produk di database
            if (!$product) {
                throw ValidationException::withMessages([
                    'items' => 'Produk tidak ditemukan.',
                ]);
            }

            // Cek produk aktif
            if (!$product->is_active) {
                throw ValidationException::withMessages([
                    'items' => "Produk '{$product->name}' sedang tidak tersedia.",
                ]);
            }

            // Cek stok produk
            if ($product->stock < $item['quantity']) {
                throw ValidationException::withMessages([
                    'items' => "Stok '{$product->name}' tidak mencukupi. Tersedia: {$product->stock}.",
                ]);
            }

            // Hitung total
            $subtotalItem = $product->price * $item['quantity'];
            $totalAmount += $subtotalItem;
        }

        // Cash validation
        $changeAmount = 0;

        if ($validated['payment_method'] === 'cash') {
            if ($validated['amount_paid'] < $totalAmount) {
                throw ValidationException::withMessages([
                    'amount_paid' => 'Jumlah uang yang diterima kurang dari total tagihan.',
                ]);
            }
            $changeAmount = $validated['amount_paid'] - $totalAmount;
        }

        // SIMPAN KE DATABASE (dalam DB::transaction)
        $transaction = DB::transaction(function () use ($validated, $products, $totalAmount, $changeAmount, $request) {
            // a. Generate transaction_code
            $transactionCode = Transaction::generateCode();

            // b. Buat record Transaction
            $amountPaid = $validated['payment_method'] === 'cash'
                ? $validated['amount_paid']
                : $totalAmount;

            $transaction = Transaction::create([
                'transaction_code' => $transactionCode,
                'user_id'          => $request->user()?->id ?? Auth::id(),
                'payment_method'   => $validated['payment_method'],
                'total_amount'     => $totalAmount,
                'amount_paid'      => $amountPaid,
                'change_amount'    => $changeAmount,
                'status'           => 'completed',
                'notes'            => $validated['notes'] ?? null,
            ]);

            // c. Loop items → buat TransactionItem (dengan snapshot nama & harga)
            // d. Kurangi stock setiap produk (Product::decrement)
            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);
                $subtotalItem = $product->price * $item['quantity'];

                $transaction->items()->create([
                    'product_id'    => $product->id,
                    'product_name'  => $product->name,
                    'product_price' => $product->price,
                    'quantity'      => $item['quantity'],
                    'subtotal'      => $subtotalItem,
                ]);

                // Kurangi stock setiap produk
                $product->decrement('stock', $item['quantity']);
            }

            return $transaction;
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success'     => true,
                'message'     => 'Transaksi berhasil disimpan.',
                'transaction' => $transaction->load('items'),
            ], 201);
        }

        return redirect()->route('checkout.receipt', $transaction);
    }

    public function receipt(Transaction $transaction)
    {
        return Inertia::render('receipt', [
            'transaction' => $transaction->load(['items', 'user']),
        ]);
    }

    public function downloadPdf(Transaction $transaction)
    {
        $transaction->load(['items', 'user']);

        $pdf = FacadePdf::loadView('receipts.pdf', [
            'transaction'  => $transaction,
            'storeName'    => config('app.store_name', 'Mochimod'),
            'storeAddress' => config('app.store_address', ''),
            'storePhone'   => config('app.store_phone', '')
        ]);

        $pdf->setPaper('A5', 'portrait');

        $filename = 'nota-' + $transaction->transaction_code + '.pdf';

        return $pdf->download($filename);
    }
}
