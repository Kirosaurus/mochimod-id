<?php

use App\Models\User;
use App\Services\SalesReportService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->service = new SalesReportService;
});

test('resolves daily date range correctly', function () {
    [$start, $end] = $this->service->resolveDateRange('daily', '2026-10-27');

    expect($start->toDateTimeString())->toBe('2026-10-27 00:00:00')
        ->and($end->toDateTimeString())->toBe('2026-10-27 23:59:59');
});

test('resolves weekly date range correctly (Senin to Minggu)', function () {
    [$start, $end] = $this->service->resolveDateRange('weekly', '2026-10-28');

    expect($start->toDateTimeString())->toBe('2026-10-26 00:00:00')
        ->and($end->toDateTimeString())->toBe('2026-11-01 23:59:59')
        ->and($start->isMonday())->toBeTrue()
        ->and($end->isSunday())->toBeTrue();
});

test('resolves monthly date range correctly (1st to end of month)', function () {
    [$start, $end] = $this->service->resolveDateRange('monthly', '2026-02-15');

    expect($start->toDateTimeString())->toBe('2026-02-01 00:00:00')
        ->and($end->toDateTimeString())->toBe('2026-02-28 23:59:59');

    [$startOct, $endOct] = $this->service->resolveDateRange('monthly', '2026-10-10');

    expect($startOct->toDateTimeString())->toBe('2026-10-01 00:00:00')
        ->and($endOct->toDateTimeString())->toBe('2026-10-31 23:59:59');
});

test('resolves previous date range correctly for all periods', function () {
    // Daily: 2026-10-27 -> previous is 2026-10-26
    [$prevDailyStart, $prevDailyEnd] = $this->service->resolvePreviousDateRange('daily', '2026-10-27');
    expect($prevDailyStart->toDateTimeString())->toBe('2026-10-26 00:00:00')
        ->and($prevDailyEnd->toDateTimeString())->toBe('2026-10-26 23:59:59');

    // Weekly: 2026-10-28 (week 2026-10-26 to 2026-11-01) -> previous week is 2026-10-19 to 2026-10-25
    [$prevWeekStart, $prevWeekEnd] = $this->service->resolvePreviousDateRange('weekly', '2026-10-28');
    expect($prevWeekStart->toDateTimeString())->toBe('2026-10-19 00:00:00')
        ->and($prevWeekEnd->toDateTimeString())->toBe('2026-10-25 23:59:59');

    // Monthly: 2026-10-15 -> previous month is 2026-09-01 to 2026-09-30
    [$prevMonthStart, $prevMonthEnd] = $this->service->resolvePreviousDateRange('monthly', '2026-10-15');
    expect($prevMonthStart->toDateTimeString())->toBe('2026-09-01 00:00:00')
        ->and($prevMonthEnd->toDateTimeString())->toBe('2026-09-30 23:59:59');
});

test('defaults to today when date is null', function () {
    Carbon::setTestNow('2026-10-27 14:00:00');

    [$start, $end] = $this->service->resolveDateRange('daily', null);

    expect($start->toDateTimeString())->toBe('2026-10-27 00:00:00')
        ->and($end->toDateTimeString())->toBe('2026-10-27 23:59:59');

    Carbon::setTestNow();
});

test('throws exception for invalid period', function () {
    $this->service->resolveDateRange('yearly', '2026-10-27');
})->throws(InvalidArgumentException::class);

test('getSummary returns empty structure when there are no transactions', function () {
    Carbon::setTestNow('2026-10-27 12:00:00');

    $summary = $this->service->getSummary('daily', '2026-10-27');

    expect($summary)->toBe([
        'total_revenue' => 0.0,
        'total_transactions' => 0,
        'avg_ticket' => 0.0,
        'payment_methods' => [
            'qris' => ['amount' => 0.0, 'count' => 0, 'percentage' => 0],
            'cash' => ['amount' => 0.0, 'count' => 0, 'percentage' => 0],
        ],
        'top_products' => [],
        'growth_percentage' => 0,
        'period_label' => 'Hari Ini',
    ]);

    Carbon::setTestNow();
});

test('getSummary calculates aggregates, top products, and growth correctly', function () {
    $user = User::factory()->create();

    $catId = DB::table('categories')->insertGetId([
        'name' => 'Daifuku',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $prod1 = DB::table('products')->insertGetId([
        'category_id' => $catId,
        'name' => 'Ichigo Daifuku',
        'stock' => 100,
        'price' => 30000,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $prod2 = DB::table('products')->insertGetId([
        'category_id' => $catId,
        'name' => 'Matcha Daifuku',
        'stock' => 100,
        'price' => 30000,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $prod3 = DB::table('products')->insertGetId([
        'category_id' => $catId,
        'name' => 'Choco Daifuku',
        'stock' => 100,
        'price' => 20000,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // 1. Transaction in previous day (2026-10-26) -> revenue: 100,000
    DB::table('transactions')->insert([
        'transaction_code' => 'TRX-20261026-0001',
        'user_id' => $user->id,
        'payment_method' => 'cash',
        'total_amount' => 100000,
        'amount_paid' => 100000,
        'change_amount' => 0,
        'status' => 'completed',
        'created_at' => '2026-10-26 12:00:00',
        'updated_at' => '2026-10-26 12:00:00',
    ]);

    // 2. Transactions in current day (2026-10-27)
    // Trx 1: QRIS 120,000 completed
    $trx1Id = DB::table('transactions')->insertGetId([
        'transaction_code' => 'TRX-20261027-0001',
        'user_id' => $user->id,
        'payment_method' => 'qris',
        'total_amount' => 120000,
        'amount_paid' => 120000,
        'change_amount' => 0,
        'status' => 'completed',
        'created_at' => '2026-10-27 10:00:00',
        'updated_at' => '2026-10-27 10:00:00',
    ]);

    // Trx 2: Cash 80,000 completed
    $trx2Id = DB::table('transactions')->insertGetId([
        'transaction_code' => 'TRX-20261027-0002',
        'user_id' => $user->id,
        'payment_method' => 'cash',
        'total_amount' => 80000,
        'amount_paid' => 100000,
        'change_amount' => 20000,
        'status' => 'completed',
        'created_at' => '2026-10-27 15:00:00',
        'updated_at' => '2026-10-27 15:00:00',
    ]);

    // Trx 3: Pending transaction (should be ignored)
    DB::table('transactions')->insert([
        'transaction_code' => 'TRX-20261027-0003',
        'user_id' => $user->id,
        'payment_method' => 'qris',
        'total_amount' => 50000,
        'status' => 'pending',
        'created_at' => '2026-10-27 16:00:00',
        'updated_at' => '2026-10-27 16:00:00',
    ]);

    // Transaction Items for Trx 1
    DB::table('transaction_items')->insert([
        [
            'transaction_id' => $trx1Id,
            'product_id' => $prod1,
            'product_name' => 'Ichigo Daifuku',
            'product_price' => 30000,
            'quantity' => 3,
            'subtotal' => 90000,
            'created_at' => '2026-10-27 10:00:00',
            'updated_at' => '2026-10-27 10:00:00',
        ],
        [
            'transaction_id' => $trx1Id,
            'product_id' => $prod2,
            'product_name' => 'Matcha Daifuku',
            'product_price' => 30000,
            'quantity' => 1,
            'subtotal' => 30000,
            'created_at' => '2026-10-27 10:00:00',
            'updated_at' => '2026-10-27 10:00:00',
        ],
    ]);

    // Transaction Items for Trx 2
    DB::table('transaction_items')->insert([
        [
            'transaction_id' => $trx2Id,
            'product_id' => $prod1,
            'product_name' => 'Ichigo Daifuku',
            'product_price' => 30000,
            'quantity' => 2,
            'subtotal' => 60000,
            'created_at' => '2026-10-27 15:00:00',
            'updated_at' => '2026-10-27 15:00:00',
        ],
        [
            'transaction_id' => $trx2Id,
            'product_id' => $prod3,
            'product_name' => 'Choco Daifuku',
            'product_price' => 20000,
            'quantity' => 1,
            'subtotal' => 20000,
            'created_at' => '2026-10-27 15:00:00',
            'updated_at' => '2026-10-27 15:00:00',
        ],
    ]);

    // Set test now to today 2026-10-27 so period_label is 'Hari Ini'
    Carbon::setTestNow('2026-10-27 18:00:00');

    $summary = $this->service->getSummary('daily', '2026-10-27');

    // Current total revenue: 120,000 + 80,000 = 200,000
    // Previous revenue: 100,000
    // Growth: ((200,000 - 100,000) / 100,000) * 100 = 100%
    // Avg ticket: 200,000 / 2 = 100,000
    // QRIS percentage: (120,000 / 200,000) * 100 = 60%
    // Cash percentage: (80,000 / 200,000) * 100 = 40%

    expect($summary['total_revenue'])->toBe(200000.0)
        ->and($summary['total_transactions'])->toBe(2)
        ->and($summary['avg_ticket'])->toBe(100000.0)
        ->and($summary['payment_methods']['qris'])->toBe([
            'amount' => 120000.0,
            'count' => 1,
            'percentage' => 60,
        ])
        ->and($summary['payment_methods']['cash'])->toBe([
            'amount' => 80000.0,
            'count' => 1,
            'percentage' => 40,
        ])
        ->and($summary['top_products'])->toBe([
            ['rank' => 1, 'product_name' => 'Ichigo Daifuku', 'total_qty' => 5],
            ['rank' => 2, 'product_name' => 'Matcha Daifuku', 'total_qty' => 1],
        ])
        ->and($summary['growth_percentage'])->toBe(100)
        ->and($summary['period_label'])->toBe('Hari Ini');

    Carbon::setTestNow();
});

test('getSummary works for weekly and monthly periods with correct labels', function () {
    Carbon::setTestNow('2026-10-27 12:00:00');

    $weeklySummary = $this->service->getSummary('weekly');
    expect($weeklySummary['period_label'])->toBe('Minggu Ini');

    $monthlySummary = $this->service->getSummary('monthly');
    expect($monthlySummary['period_label'])->toBe('Bulan Ini');

    Carbon::setTestNow();
});
