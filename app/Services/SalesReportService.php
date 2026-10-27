<?php

namespace App\Services;

use Carbon\CarbonInterface;
use DateTimeInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class SalesReportService
{
    /**
     * Mengubah periode dan anchor date menjadi rentang tanggal [$startDate, $endDate].
     *
     * @param  string  $period  'daily' | 'weekly' | 'monthly'
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

    /**
     * Mengubah periode dan anchor date menjadi rentang tanggal periode sebelumnya [$prevStartDate, $prevEndDate].
     *
     * @param  string  $period  'daily' | 'weekly' | 'monthly'
     * @return array{0: CarbonInterface, 1: CarbonInterface}
     */
    public function resolvePreviousDateRange(string $period, DateTimeInterface|string|null $date = null): array
    {
        [$startDate] = $this->resolveDateRange($period, $date);

        $previousDate = match ($period) {
            'daily' => $startDate->copy()->subDay(),
            'weekly' => $startDate->copy()->subWeek(),
            'monthly' => $startDate->copy()->subMonthNoOverflow(),
            default => $startDate->copy()->subDay(),
        };

        return $this->resolveDateRange($period, $previousDate);
    }

    /**
     * Mendapatkan label periode (contoh: "Hari Ini", "Minggu Ini", "Bulan Ini").
     *
     * @param  string  $period  'daily' | 'weekly' | 'monthly'
     */
    public function resolvePeriodLabel(string $period, DateTimeInterface|string|null $date = null): string
    {
        $targetDate = $date ? Carbon::parse($date) : Carbon::now();
        [$startDate, $endDate] = $this->resolveDateRange($period, $date);

        return match ($period) {
            'daily' => $targetDate->isToday() ? 'Hari Ini' : $targetDate->format('d M Y'),
            'weekly' => $targetDate->isCurrentWeek() ? 'Minggu Ini' : 'Pekan '.$startDate->format('d M').' - '.$endDate->format('d M Y'),
            'monthly' => $targetDate->isCurrentMonth() ? 'Bulan Ini' : $targetDate->format('F Y'),
            default => 'Hari Ini',
        };
    }

    /**
     * Menghitung ringkasan laporan penjualan berdasarkan periode dan anchor date.
     *
     * @param  string  $period  'daily' | 'weekly' | 'monthly'
     */
    public function getSummary(string $period, DateTimeInterface|string|null $date = null): array
    {
        [$startDate, $endDate] = $this->resolveDateRange($period, $date);
        [$prevStartDate, $prevEndDate] = $this->resolvePreviousDateRange($period, $date);

        // 1. Query Utama (Aggregates)
        $aggregates = DB::table('transactions')
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw("
                COALESCE(SUM(total_amount), 0) AS total_revenue,
                COUNT(*) AS total_transactions,
                COALESCE(AVG(total_amount), 0) AS avg_ticket,
                COALESCE(SUM(CASE WHEN payment_method = 'qris' THEN total_amount ELSE 0 END), 0) AS qris_amount,
                COALESCE(SUM(CASE WHEN payment_method = 'cash' THEN total_amount ELSE 0 END), 0) AS cash_amount,
                COUNT(CASE WHEN payment_method = 'qris' THEN 1 END) AS qris_count,
                COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) AS cash_count
            ")
            ->first();

        $totalRevenue = (float) ($aggregates->total_revenue ?? 0);
        $totalTransactions = (int) ($aggregates->total_transactions ?? 0);
        $avgTicket = (float) round((float) ($aggregates->avg_ticket ?? 0), 2);

        $qrisAmount = (float) ($aggregates->qris_amount ?? 0);
        $cashAmount = (float) ($aggregates->cash_amount ?? 0);
        $qrisCount = (int) ($aggregates->qris_count ?? 0);
        $cashCount = (int) ($aggregates->cash_count ?? 0);

        $qrisPercentage = $totalRevenue > 0 ? (int) round(($qrisAmount / $totalRevenue) * 100) : 0;
        $cashPercentage = $totalRevenue > 0 ? (int) round(($cashAmount / $totalRevenue) * 100) : 0;

        // 2. Query Produk Terlaris (Top 2 Products)
        $topProducts = DB::table('transaction_items as ti')
            ->join('transactions as t', 't.id', '=', 'ti.transaction_id')
            ->where('t.status', 'completed')
            ->whereBetween('t.created_at', [$startDate, $endDate])
            ->groupBy('ti.product_id', 'ti.product_name')
            ->orderByDesc('total_qty')
            ->limit(2)
            ->select([
                'ti.product_name',
                'ti.product_id',
                DB::raw('SUM(ti.quantity) as total_qty'),
            ])
            ->get()
            ->values()
            ->map(fn ($item, $index) => [
                'rank' => $index + 1,
                'product_name' => $item->product_name,
                'total_qty' => (int) $item->total_qty,
            ])
            ->all();

        // 3. Perbandingan Periode Sebelumnya (Growth Percentage)
        $prevRevenue = (float) DB::table('transactions')
            ->where('status', 'completed')
            ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->sum('total_amount');

        if ($prevRevenue > 0) {
            $growth = round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100, 1);
            $growthPercentage = ((int) $growth == $growth) ? (int) $growth : $growth;
        } else {
            $growthPercentage = $totalRevenue > 0 ? 100 : 0;
        }

        // 4. Label Periode
        $periodLabel = $this->resolvePeriodLabel($period, $date);

        return [
            'total_revenue' => $totalRevenue,
            'total_transactions' => $totalTransactions,
            'avg_ticket' => $avgTicket,
            'payment_methods' => [
                'qris' => [
                    'amount' => $qrisAmount,
                    'count' => $qrisCount,
                    'percentage' => $qrisPercentage,
                ],
                'cash' => [
                    'amount' => $cashAmount,
                    'count' => $cashCount,
                    'percentage' => $cashPercentage,
                ],
            ],
            'top_products' => $topProducts,
            'growth_percentage' => $growthPercentage,
            'period_label' => $periodLabel,
        ];
    }
}
