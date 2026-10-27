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

test('getChartData returns daily chart with 24 hours gap-filled', function () {
    $user = User::factory()->create();

    // Insert 2 completed transactions at 10:15 and 14:45
    DB::table('transactions')->insert([
        [
            'transaction_code' => 'TRX-20261027-C01',
            'user_id' => $user->id,
            'payment_method' => 'cash',
            'total_amount' => 50000,
            'status' => 'completed',
            'created_at' => '2026-10-27 10:15:00',
            'updated_at' => '2026-10-27 10:15:00',
        ],
        [
            'transaction_code' => 'TRX-20261027-C02',
            'user_id' => $user->id,
            'payment_method' => 'qris',
            'total_amount' => 150000,
            'status' => 'completed',
            'created_at' => '2026-10-27 14:45:00',
            'updated_at' => '2026-10-27 14:45:00',
        ],
        [
            // Pending transaction should be ignored
            'transaction_code' => 'TRX-20261027-C03',
            'user_id' => $user->id,
            'payment_method' => 'cash',
            'total_amount' => 300000,
            'status' => 'pending',
            'created_at' => '2026-10-27 14:50:00',
            'updated_at' => '2026-10-27 14:50:00',
        ],
    ]);

    $chart = $this->service->getChartData('daily', '2026-10-27');

    expect($chart['labels'])->toHaveCount(24)
        ->and($chart['labels'][0])->toBe('00:00')
        ->and($chart['labels'][10])->toBe('10:00')
        ->and($chart['labels'][14])->toBe('14:00')
        ->and($chart['labels'][23])->toBe('23:00')
        ->and($chart['datasets'][0]['data'])->toHaveCount(24)
        ->and($chart['datasets'][0]['data'][10])->toBe(50000)
        ->and($chart['datasets'][0]['data'][14])->toBe(150000)
        ->and($chart['datasets'][0]['data'][0])->toBe(0)
        ->and($chart['peak'])->toBe([
            'label' => '14:00',
            'value' => 150000,
        ]);
});

test('getChartData returns weekly chart with 7 days and correct peak', function () {
    $user = User::factory()->create();

    // Week of 2026-10-28:
    // Senin: 2026-10-26
    // Rabu: 2026-10-28 (peak)
    // Minggu: 2026-11-01
    DB::table('transactions')->insert([
        [
            'transaction_code' => 'TRX-W01',
            'user_id' => $user->id,
            'payment_method' => 'cash',
            'total_amount' => 120000,
            'status' => 'completed',
            'created_at' => '2026-10-26 10:00:00', // Senin
            'updated_at' => '2026-10-26 10:00:00',
        ],
        [
            'transaction_code' => 'TRX-W02',
            'user_id' => $user->id,
            'payment_method' => 'qris',
            'total_amount' => 740000,
            'status' => 'completed',
            'created_at' => '2026-10-28 11:00:00', // Rabu
            'updated_at' => '2026-10-28 11:00:00',
        ],
        [
            'transaction_code' => 'TRX-W03',
            'user_id' => $user->id,
            'payment_method' => 'cash',
            'total_amount' => 200000,
            'status' => 'completed',
            'created_at' => '2026-11-01 16:00:00', // Minggu
            'updated_at' => '2026-11-01 16:00:00',
        ],
    ]);

    $chart = $this->service->getChartData('weekly', '2026-10-28');

    expect($chart['labels'])->toBe(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'])
        ->and($chart['datasets'][0]['data'])->toBe([120000, 0, 740000, 0, 0, 0, 200000])
        ->and($chart['peak'])->toBe([
            'label' => 'Rabu',
            'value' => 740000,
        ]);
});

test('getChartData returns monthly chart with exact days in month', function () {
    $user = User::factory()->create();

    // October 2026 has 31 days
    DB::table('transactions')->insert([
        [
            'transaction_code' => 'TRX-M01',
            'user_id' => $user->id,
            'payment_method' => 'cash',
            'total_amount' => 250000,
            'status' => 'completed',
            'created_at' => '2026-10-05 09:00:00', // Day 5
            'updated_at' => '2026-10-05 09:00:00',
        ],
        [
            'transaction_code' => 'TRX-M02',
            'user_id' => $user->id,
            'payment_method' => 'qris',
            'total_amount' => 500000,
            'status' => 'completed',
            'created_at' => '2026-10-20 14:00:00', // Day 20 (peak)
            'updated_at' => '2026-10-20 14:00:00',
        ],
    ]);

    $chart = $this->service->getChartData('monthly', '2026-10-15');

    expect($chart['labels'])->toHaveCount(31)
        ->and($chart['labels'][0])->toBe('1')
        ->and($chart['labels'][30])->toBe('31')
        ->and($chart['datasets'][0]['data'])->toHaveCount(31)
        ->and($chart['datasets'][0]['data'][4])->toBe(250000) // Day 5 index 4
        ->and($chart['datasets'][0]['data'][19])->toBe(500000) // Day 20 index 19
        ->and($chart['datasets'][0]['data'][0])->toBe(0)
        ->and($chart['peak'])->toBe([
            'label' => '20',
            'value' => 500000,
        ]);
});

test('getChartData handles empty period with zero peak', function () {
    $chart = $this->service->getChartData('weekly', '2026-10-28');

    expect($chart['labels'])->toHaveCount(7)
        ->and($chart['datasets'][0]['data'])->toBe([0, 0, 0, 0, 0, 0, 0])
        ->and($chart['peak'])->toBe([
            'label' => null,
            'value' => 0,
        ]);
});

test('getCategorySales returns empty structure when no sales exist', function () {
    $result = $this->service->getCategorySales('daily', '2026-10-27');

    expect($result)->toBe([
        'total_qty' => 0,
        'categories' => [],
    ]);
});

test('getCategorySales calculates category quantities and percentages correctly', function () {
    $user = User::factory()->create();

    // Completed Transaction 1
    $trx1 = DB::table('transactions')->insertGetId([
        'transaction_code' => 'TRX-CAT-01',
        'user_id' => $user->id,
        'payment_method' => 'qris',
        'total_amount' => 500000,
        'status' => 'completed',
        'created_at' => '2026-10-27 10:00:00',
        'updated_at' => '2026-10-27 10:00:00',
    ]);

    // Completed Transaction 2
    $trx2 = DB::table('transactions')->insertGetId([
        'transaction_code' => 'TRX-CAT-02',
        'user_id' => $user->id,
        'payment_method' => 'cash',
        'total_amount' => 400000,
        'status' => 'completed',
        'created_at' => '2026-10-27 15:00:00',
        'updated_at' => '2026-10-27 15:00:00',
    ]);

    // Pending Transaction (must be ignored)
    $trxPending = DB::table('transactions')->insertGetId([
        'transaction_code' => 'TRX-CAT-PENDING',
        'user_id' => $user->id,
        'payment_method' => 'cash',
        'total_amount' => 100000,
        'status' => 'pending',
        'created_at' => '2026-10-27 16:00:00',
        'updated_at' => '2026-10-27 16:00:00',
    ]);

    // Insert Items for Trx 1:
    // Daifuku Buah Segar: 50
    // Classic Traditional Mochi: 41
    // Item with null category_name: 10 (should be excluded)
    DB::table('transaction_items')->insert([
        [
            'transaction_id' => $trx1,
            'product_name' => 'Ichigo Daifuku',
            'category_name' => 'Daifuku Buah Segar',
            'product_price' => 10000,
            'quantity' => 50,
            'subtotal' => 500000,
            'created_at' => '2026-10-27 10:00:00',
            'updated_at' => '2026-10-27 10:00:00',
        ],
        [
            'transaction_id' => $trx1,
            'product_name' => 'Mochi Wijen',
            'category_name' => 'Classic Traditional Mochi',
            'product_price' => 5000,
            'quantity' => 41,
            'subtotal' => 205000,
            'created_at' => '2026-10-27 10:00:00',
            'updated_at' => '2026-10-27 10:00:00',
        ],
        [
            'transaction_id' => $trx1,
            'product_name' => 'Custom Item',
            'category_name' => null,
            'product_price' => 5000,
            'quantity' => 10,
            'subtotal' => 50000,
            'created_at' => '2026-10-27 10:00:00',
            'updated_at' => '2026-10-27 10:00:00',
        ],
    ]);

    // Insert Items for Trx 2:
    // Daifuku Buah Segar: 40 (total becomes 90)
    // Paket Gift Box (Mix 4/6): 33
    DB::table('transaction_items')->insert([
        [
            'transaction_id' => $trx2,
            'product_name' => 'Kiwifuku',
            'category_name' => 'Daifuku Buah Segar',
            'product_price' => 10000,
            'quantity' => 40,
            'subtotal' => 400000,
            'created_at' => '2026-10-27 15:00:00',
            'updated_at' => '2026-10-27 15:00:00',
        ],
        [
            'transaction_id' => $trx2,
            'product_name' => 'Gift Box 4',
            'category_name' => 'Paket Gift Box (Mix 4/6)',
            'product_price' => 40000,
            'quantity' => 33,
            'subtotal' => 1320000,
            'created_at' => '2026-10-27 15:00:00',
            'updated_at' => '2026-10-27 15:00:00',
        ],
    ]);

    // Items for Pending Trx (must not be counted)
    DB::table('transaction_items')->insert([
        [
            'transaction_id' => $trxPending,
            'product_name' => 'Kiwifuku',
            'category_name' => 'Daifuku Buah Segar',
            'product_price' => 10000,
            'quantity' => 99,
            'subtotal' => 990000,
            'created_at' => '2026-10-27 16:00:00',
            'updated_at' => '2026-10-27 16:00:00',
        ],
    ]);

    $result = $this->service->getCategorySales('daily', '2026-10-27');

    // Total Qty: 90 + 41 + 33 = 164
    // Daifuku Buah Segar: 90 / 164 = 54.87% -> 55%
    // Classic Traditional Mochi: 41 / 164 = 25%
    // Paket Gift Box (Mix 4/6): 33 / 164 = 20.12% -> 20%
    expect($result)->toBe([
        'total_qty' => 164,
        'categories' => [
            ['name' => 'Daifuku Buah Segar', 'qty' => 90, 'percentage' => 55],
            ['name' => 'Classic Traditional Mochi', 'qty' => 41, 'percentage' => 25],
            ['name' => 'Paket Gift Box (Mix 4/6)', 'qty' => 33, 'percentage' => 20],
        ],
    ]);
});
