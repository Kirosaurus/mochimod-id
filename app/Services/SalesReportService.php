<?php

namespace App\Services;

use Carbon\CarbonInterface;
use DateTimeInterface;
use Illuminate\Support\Carbon;
use InvalidArgumentException;

class SalesReportService
{
    /**
     * Mengubah periode dan anchor date menjadi rentang tanggal [$startDate, $endDate].
     *
     * @param string $period 'daily' | 'weekly' | 'monthly'
     * @param DateTimeInterface|string|null $date
     * @return array{0: CarbonInterface, 1: CarbonInterface}
     */
    public function resolveDateRange(string $period, DateTimeInterface|string|null $date = null): array
    {
        $targetDate = $date ? Carbon::parse($date) : Carbon::now();

        return match ($period) {
            'daily' => [
                $targetDate->copy()->startOfDay(),
                $targetDate->copy()->endOfDay(),
            ],
            'weekly' => [
                $targetDate->copy()->startOfWeek(CarbonInterface::MONDAY)->startOfDay(),
                $targetDate->copy()->endOfWeek(CarbonInterface::SUNDAY)->endOfDay(),
            ],
            'monthly' => [
                $targetDate->copy()->startOfMonth()->startOfDay(),
                $targetDate->copy()->endOfMonth()->endOfDay(),
            ],
            default => throw new InvalidArgumentException("Periode [{$period}] tidak valid. Gunakan 'daily', 'weekly', atau 'monthly'."),
        };
    }
}
