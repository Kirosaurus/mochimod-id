<?php

namespace App\Services;

use App\Models\Transaction;
use Carbon\CarbonInterface;
use DateTimeInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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

    /**
     * Mengambil data chart per jam (daily), per hari (weekly), atau per tanggal (monthly).
     *
     * @param  string  $period  'daily' | 'weekly' | 'monthly'
     */
    public function getChartData(string $period, DateTimeInterface|string|null $date = null): array
    {
        [$startDate, $endDate] = $this->resolveDateRange($period, $date);

        $driver = DB::connection()->getDriverName();

        return match ($period) {
            'daily' => $this->getDailyChartData($startDate, $endDate, $driver),
            'weekly' => $this->getWeeklyChartData($startDate, $endDate, $driver),
            'monthly' => $this->getMonthlyChartData($startDate, $endDate, $driver),
            default => throw new InvalidArgumentException("Periode [{$period}] tidak valid. Gunakan 'daily', 'weekly', atau 'monthly'."),
        };
    }

    /**
     * Data chart harian (24 jam: 00:00 - 23:00).
     */
    protected function getDailyChartData(CarbonInterface $startDate, CarbonInterface $endDate, string $driver): array
    {
        $hourExpr = match ($driver) {
            'sqlite' => "CAST(strftime('%H', created_at) AS INTEGER)",
            'pgsql' => 'EXTRACT(HOUR FROM created_at)::INTEGER',
            default => 'HOUR(created_at)',
        };

        $rows = DB::table('transactions')
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw("{$hourExpr} AS label, SUM(total_amount) AS revenue")
            ->groupByRaw($hourExpr)
            ->get();

        $labels = array_map(fn ($h) => sprintf('%02d:00', $h), range(0, 23));
        $data = array_fill(0, 24, 0);

        foreach ($rows as $row) {
            $hour = (int) $row->label;
            if ($hour >= 0 && $hour < 24) {
                $revenue = (float) $row->revenue;
                $data[$hour] = ((int) $revenue == $revenue) ? (int) $revenue : $revenue;
            }
        }

        return $this->formatChartResponse($labels, $data);
    }

    /**
     * Data chart mingguan (7 hari: Senin - Minggu).
     */
    protected function getWeeklyChartData(CarbonInterface $startDate, CarbonInterface $endDate, string $driver): array
    {
        $dayOfWeekExpr = match ($driver) {
            'sqlite' => "(CAST(strftime('%w', created_at) AS INTEGER) + 1)",
            'pgsql' => '(EXTRACT(DOW FROM created_at)::INTEGER + 1)',
            default => 'DAYOFWEEK(created_at)',
        };

        $rows = DB::table('transactions')
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw("{$dayOfWeekExpr} AS day_num, SUM(total_amount) AS revenue")
            ->groupByRaw($dayOfWeekExpr)
            ->get();

        $labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        $data = array_fill(0, 7, 0);

        $dayIndexMap = [
            2 => 0, // Senin
            3 => 1, // Selasa
            4 => 2, // Rabu
            5 => 3, // Kamis
            6 => 4, // Jumat
            7 => 5, // Sabtu
            1 => 6, // Minggu
        ];

        foreach ($rows as $row) {
            $dayNum = (int) $row->day_num;
            if (isset($dayIndexMap[$dayNum])) {
                $revenue = (float) $row->revenue;
                $data[$dayIndexMap[$dayNum]] = ((int) $revenue == $revenue) ? (int) $revenue : $revenue;
            }
        }

        return $this->formatChartResponse($labels, $data);
    }

    /**
     * Data chart bulanan (28 - 31 hari per tanggal).
     */
    protected function getMonthlyChartData(CarbonInterface $startDate, CarbonInterface $endDate, string $driver): array
    {
        $dayExpr = match ($driver) {
            'sqlite' => "CAST(strftime('%d', created_at) AS INTEGER)",
            'pgsql' => 'EXTRACT(DAY FROM created_at)::INTEGER',
            default => 'DAY(created_at)',
        };

        $rows = DB::table('transactions')
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw("{$dayExpr} AS label, SUM(total_amount) AS revenue")
            ->groupByRaw($dayExpr)
            ->get();

        $daysInMonth = (int) $startDate->daysInMonth;
        $labels = array_map(fn ($d) => (string) $d, range(1, $daysInMonth));
        $data = array_fill(0, $daysInMonth, 0);

        foreach ($rows as $row) {
            $day = (int) $row->label;
            if ($day >= 1 && $day <= $daysInMonth) {
                $revenue = (float) $row->revenue;
                $data[$day - 1] = ((int) $revenue == $revenue) ? (int) $revenue : $revenue;
            }
        }

        return $this->formatChartResponse($labels, $data);
    }

    /**
     * Format output standar untuk chart data.
     *
     * @param  array<string>  $labels
     * @param  array<int|float>  $data
     */
    protected function formatChartResponse(array $labels, array $data): array
    {
        $maxValue = ! empty($data) ? max($data) : 0;
        $peakIndex = ! empty($data) ? array_search($maxValue, $data) : false;

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Pendapatan (IDR)',
                    'data' => $data,
                ],
            ],
            'peak' => [
                'label' => ($maxValue > 0 && $peakIndex !== false) ? $labels[$peakIndex] : null,
                'value' => $maxValue,
            ],
        ];
    }

    /**
     * Mengambil proporsi penjualan berdasarkan kategori produk.
     *
     * @param  string  $period  'daily' | 'weekly' | 'monthly'
     */
    public function getCategorySales(string $period, DateTimeInterface|string|null $date = null): array
    {
        [$startDate, $endDate] = $this->resolveDateRange($period, $date);

        $rows = DB::table('transaction_items as ti')
            ->join('transactions as t', 't.id', '=', 'ti.transaction_id')
            ->where('t.status', 'completed')
            ->whereBetween('t.created_at', [$startDate, $endDate])
            ->whereNotNull('ti.category_name')
            ->groupBy('ti.category_name')
            ->orderByDesc('total_qty')
            ->select([
                'ti.category_name',
                DB::raw('SUM(ti.quantity) as total_qty'),
            ])
            ->get();

        $totalQty = (int) $rows->sum('total_qty');

        $categories = $rows->map(function ($row) use ($totalQty) {
            $qty = (int) $row->total_qty;
            $percentage = $totalQty > 0 ? (int) round(($qty / $totalQty) * 100) : 0;

            return [
                'name' => $row->category_name,
                'qty' => $qty,
                'percentage' => $percentage,
            ];
        })->values()->all();

        return [
            'total_qty' => $totalQty,
            'categories' => $categories,
        ];
    }

    /**
     * Mengambil riwayat transaksi dengan pagination dan fitur pencarian.
     *
     * @param  string  $period  'daily' | 'weekly' | 'monthly'
     */
    public function getTransactionHistory(
        string $period,
        DateTimeInterface|string|null $date = null,
        ?string $search = null,
        ?int $page = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        [$startDate, $endDate] = $this->resolveDateRange($period, $date);

        return Transaction::with(['items' => fn ($q) => $q->select('id', 'transaction_id', 'product_name', 'quantity')])
            ->select(['id', 'transaction_code', 'payment_method', 'total_amount', 'status', 'created_at'])
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->when($search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('transaction_code', 'like', "%{$search}%")
                        ->orWhereHas('items', fn ($q) => $q->where('product_name', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
