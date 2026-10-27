<?php

use App\Services\SalesReportService;
use Illuminate\Support\Carbon;

beforeEach(function () {
    $this->service = new SalesReportService();
});

test('resolves daily date range correctly', function () {
    [$start, $end] = $this->service->resolveDateRange('daily', '2026-10-27');

    expect($start->toDateTimeString())->toBe('2026-10-27 00:00:00')
        ->and($end->toDateTimeString())->toBe('2026-10-27 23:59:59');
});

test('resolves weekly date range correctly (Senin to Minggu)', function () {
    // 2026-10-28 is Wednesday
    // Monday of that week: 2026-10-26
    // Sunday of that week: 2026-11-01
    [$start, $end] = $this->service->resolveDateRange('weekly', '2026-10-28');

    expect($start->toDateTimeString())->toBe('2026-10-26 00:00:00')
        ->and($end->toDateTimeString())->toBe('2026-11-01 23:59:59')
        ->and($start->isMonday())->toBeTrue()
        ->and($end->isSunday())->toBeTrue();
});

test('resolves monthly date range correctly (1st to end of month)', function () {
    // 2026-02 has 28 days (non-leap year)
    [$start, $end] = $this->service->resolveDateRange('monthly', '2026-02-15');

    expect($start->toDateTimeString())->toBe('2026-02-01 00:00:00')
        ->and($end->toDateTimeString())->toBe('2026-02-28 23:59:59');

    // 2026-10 has 31 days
    [$startOct, $endOct] = $this->service->resolveDateRange('monthly', '2026-10-10');

    expect($startOct->toDateTimeString())->toBe('2026-10-01 00:00:00')
        ->and($endOct->toDateTimeString())->toBe('2026-10-31 23:59:59');
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
