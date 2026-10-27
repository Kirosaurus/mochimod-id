<?php

namespace App\Http\Controllers;

use App\Http\Requests\SalesReportRequest;
use App\Models\Transaction;
use App\Services\SalesReportService;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SalesReportController extends Controller
{
    public function __construct(
        protected SalesReportService $salesReportService
    ) {}

    /**
     * Render Inertia page awal (tanpa data berat untuk TTFB cepat).
     */
    public function show(): InertiaResponse
    {
        return Inertia::render('sales-report');
    }

    /**
     * JSON: getSummary() + getCategorySales() dengan caching.
     */
    public function summary(SalesReportRequest $request): JsonResponse
    {
        $period = $request->validated('period');
        $date = $request->validated('date');
        $dateFormatted = ($date ? Carbon::parse($date) : Carbon::today())->format('Y-m-d');

        $cacheKey = "sales_report.summary.{$period}.{$dateFormatted}";

        $data = $this->salesReportService->rememberCache($cacheKey, $period, function () use ($period, $date) {
            $summary = $this->salesReportService->getSummary($period, $date);
            $categorySales = $this->salesReportService->getCategorySales($period, $date);

            return array_merge($summary, [
                'category_sales' => $categorySales,
            ]);
        });

        return response()->json($data);
    }

    /**
     * JSON: getChartData() dengan caching.
     */
    public function chart(SalesReportRequest $request): JsonResponse
    {
        $period = $request->validated('period');
        $date = $request->validated('date');
        $dateFormatted = ($date ? Carbon::parse($date) : Carbon::today())->format('Y-m-d');

        $cacheKey = "sales_report.chart.{$period}.{$dateFormatted}";

        $data = $this->salesReportService->rememberCache($cacheKey, $period, function () use ($period, $date) {
            return $this->salesReportService->getChartData($period, $date);
        });

        return response()->json($data);
    }

    /**
     * JSON: getTransactionHistory() + paginator (tanpa cache).
     */
    public function history(SalesReportRequest $request): JsonResponse
    {
        $paginator = $this->salesReportService->getTransactionHistory(
            period: $request->validated('period'),
            date: $request->validated('date'),
            search: $request->validated('search'),
            page: $request->validated('page') ? (int) $request->validated('page') : null,
        );

        return response()->json($paginator);
    }

    /**
     * PDF via DomPDF (sama seperti CheckoutController).
     */
    public function downloadPdf(SalesReportRequest $request): Response
    {
        $period = $request->validated('period');
        $date = $request->validated('date');

        [$startDate, $endDate] = $this->salesReportService->resolveDateRange($period, $date);

        $summary = $this->salesReportService->getSummary($period, $date);
        $chartData = $this->salesReportService->getChartData($period, $date);
        $categorySales = $this->salesReportService->getCategorySales($period, $date);

        // Riwayat transaksi lengkap tanpa pagination untuk PDF
        $transactions = Transaction::with(['items' => fn ($q) => $q->select('id', 'transaction_id', 'product_name', 'quantity', 'product_price', 'subtotal')])
            ->select(['id', 'transaction_code', 'payment_method', 'total_amount', 'status', 'created_at'])
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderByDesc('created_at')
            ->get();

        $pdf = FacadePdf::loadView('reports.sales-report-pdf', [
            'period' => $period,
            'date' => $date,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'summary' => $summary,
            'chartData' => $chartData,
            'categorySales' => $categorySales,
            'transactions' => $transactions,
            'store_name' => config('app.store_name', env('STORE_NAME', 'Mochimod')),
            'store_address' => config('app.store_address', env('STORE_ADDRESS', '')),
            'store_phone' => config('app.store_phone', env('STORE_PHONE', '')),
        ]);

        $pdf->setPaper('A4', 'portrait');

        $filename = 'laporan-penjualan-'.$period.'-'.$startDate->format('Ymd').'.pdf';

        return $pdf->download($filename);
    }
}
