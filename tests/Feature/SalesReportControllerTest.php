<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('unauthenticated users cannot access sales report endpoints', function () {
    $this->get('/laporan-penjualan')->assertRedirect('/login');
    $this->getJson('/laporan-penjualan/summary?period=daily')->assertUnauthorized();
    $this->getJson('/laporan-penjualan/chart?period=daily')->assertUnauthorized();
    $this->getJson('/laporan-penjualan/history?period=daily')->assertUnauthorized();
    $this->get('/laporan-penjualan/pdf?period=daily')->assertRedirect('/login');
});

test('show endpoint renders inertia sales-report page', function () {
    $this->actingAs($this->user)
        ->get('/laporan-penjualan')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('sales-report'));
});

test('summary endpoint returns json summary and category sales', function () {
    $cat = Category::create(['name' => 'Daifuku']);
    $prod = Product::create([
        'category_id' => $cat->id,
        'name' => 'Ichigo Daifuku',
        'stock' => 50,
        'price' => 30000,
        'is_active' => true,
    ]);

    $trx = DB::table('transactions')->insertGetId([
        'transaction_code' => 'TRX-SUM-01',
        'user_id' => $this->user->id,
        'payment_method' => 'qris',
        'total_amount' => 60000,
        'status' => 'completed',
        'created_at' => '2026-10-27 10:00:00',
        'updated_at' => '2026-10-27 10:00:00',
    ]);

    DB::table('transaction_items')->insert([
        'transaction_id' => $trx,
        'product_id' => $prod->id,
        'product_name' => 'Ichigo Daifuku',
        'category_name' => 'Daifuku',
        'product_price' => 30000,
        'quantity' => 2,
        'subtotal' => 60000,
        'created_at' => '2026-10-27 10:00:00',
        'updated_at' => '2026-10-27 10:00:00',
    ]);

    $response = $this->actingAs($this->user)
        ->getJson('/laporan-penjualan/summary?period=daily&date=2026-10-27');

    $response->assertOk()
        ->assertJsonStructure([
            'total_revenue',
            'total_transactions',
            'avg_ticket',
            'payment_methods' => ['qris', 'cash'],
            'top_products',
            'growth_percentage',
            'period_label',
            'category_sales' => ['total_qty', 'categories'],
        ])
        ->assertJsonPath('total_revenue', 60000)
        ->assertJsonPath('total_transactions', 1)
        ->assertJsonPath('category_sales.total_qty', 2);
});

test('chart endpoint returns json chart datasets and peak', function () {
    $response = $this->actingAs($this->user)
        ->getJson('/laporan-penjualan/chart?period=weekly&date=2026-10-28');

    $response->assertOk()
        ->assertJsonStructure([
            'labels',
            'datasets' => [
                ['label', 'data'],
            ],
            'peak' => ['label', 'value'],
        ])
        ->assertJsonPath('labels', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']);
});

test('history endpoint returns paginated transaction list', function () {
    DB::table('transactions')->insert([
        'transaction_code' => 'TRX-HIST-01',
        'user_id' => $this->user->id,
        'payment_method' => 'cash',
        'total_amount' => 50000,
        'status' => 'completed',
        'created_at' => '2026-10-27 10:00:00',
        'updated_at' => '2026-10-27 10:00:00',
    ]);

    $response = $this->actingAs($this->user)
        ->getJson('/laporan-penjualan/history?period=daily&date=2026-10-27');

    $response->assertOk()
        ->assertJsonStructure([
            'data',
            'current_page',
            'total',
        ])
        ->assertJsonPath('total', 1)
        ->assertJsonPath('data.0.transaction_code', 'TRX-HIST-01');
});

test('pdf download endpoint returns application/pdf response', function () {
    DB::table('transactions')->insert([
        'transaction_code' => 'TRX-PDF-01',
        'user_id' => $this->user->id,
        'payment_method' => 'cash',
        'total_amount' => 50000,
        'status' => 'completed',
        'created_at' => '2026-10-27 10:00:00',
        'updated_at' => '2026-10-27 10:00:00',
    ]);

    $response = $this->actingAs($this->user)
        ->get('/laporan-penjualan/pdf?period=daily&date=2026-10-27');

    $response->assertOk()
        ->assertHeader('content-type', 'application/pdf');
});

test('endpoints validate period query parameter', function () {
    $this->actingAs($this->user)
        ->getJson('/laporan-penjualan/summary?period=yearly')
        ->assertStatus(422)
        ->assertJsonValidationErrors(['period']);
});

test('checkout confirmation flushes sales report cache', function () {
    $cat = Category::create(['name' => 'Mochi Buah']);
    $prod = Product::create([
        'category_id' => $cat->id,
        'name' => 'Strawberry Mochi',
        'stock' => 10,
        'price' => 20000,
        'is_active' => true,
    ]);

    // First request to prime the cache
    Carbon::setTestNow('2026-10-27 12:00:00');

    $res1 = $this->actingAs($this->user)
        ->getJson('/laporan-penjualan/summary?period=daily&date=2026-10-27');
    expect($res1->json('total_revenue'))->toBe(0);

    // Perform checkout confirm
    $this->actingAs($this->user)
        ->postJson('/checkout/confirm', [
            'payment_method' => 'cash',
            'amount_paid' => 40000,
            'items' => [
                [
                    'product_id' => $prod->id,
                    'quantity' => 2,
                ],
            ],
        ])
        ->assertCreated();

    // Next request should reflect updated revenue (cache was flushed)
    $res2 = $this->actingAs($this->user)
        ->getJson('/laporan-penjualan/summary?period=daily&date=2026-10-27');
    expect($res2->json('total_revenue'))->toBe(40000);

    Carbon::setTestNow();
});
