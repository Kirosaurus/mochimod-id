<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

test('convert-utc-to-wib command shifts timestamps before cutoff by 7 hours', function () {
    $user = User::factory()->create();

    $trxId = DB::table('transactions')->insertGetId([
        'transaction_code' => 'TRX-CONVERT-01',
        'user_id' => $user->id,
        'payment_method' => 'cash',
        'total_amount' => 50000,
        'status' => 'completed',
        'created_at' => '2026-11-03 03:01:17',
        'updated_at' => '2026-11-03 03:01:17',
    ]);

    $itemId = DB::table('transaction_items')->insertGetId([
        'transaction_id' => $trxId,
        'product_name' => 'Ichigo Daifuku',
        'product_price' => 25000,
        'quantity' => 2,
        'subtotal' => 50000,
        'created_at' => '2026-11-03 03:01:17',
        'updated_at' => '2026-11-03 03:01:17',
    ]);

    $this->artisan('app:convert-utc-to-wib', ['--cutoff' => '2026-11-03 10:28:00'])
        ->assertSuccessful();

    $trx = DB::table('transactions')->where('id', $trxId)->first();
    $item = DB::table('transaction_items')->where('id', $itemId)->first();

    // 03:01:17 + 7 hours = 10:01:17
    expect($trx->created_at)->toBe('2026-11-03 10:01:17')
        ->and($item->created_at)->toBe('2026-11-03 10:01:17');
});
