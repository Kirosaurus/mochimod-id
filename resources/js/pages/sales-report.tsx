import { Head } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/main-layout';

type Period = 'daily' | 'weekly' | 'monthly';

type Summary = {
    total_revenue: number;
    total_transactions: number;
    avg_ticket: number;
    growth_percentage: number;
    period_label: string;
    payment_methods: {
        qris: { amount: number; count: number; percentage: number };
        cash: { amount: number; count: number; percentage: number };
    };
    top_products: Array<{
        rank: number;
        product_name: string;
        total_qty: number;
    }>;
};

type ChartData = {
    labels: string[];
    datasets: Array<{ data: number[] }>;
    peak: { label: string | null; value: number };
};

type CategorySales = {
    total_qty: number;
    categories: Array<{ name: string; qty: number; percentage: number }>;
};

type TransactionHistoryItem = {
    id: number;
    transaction_code: string;
    payment_method: 'cash' | 'qris';
    total_amount: number | string;
    status: string;
    created_at: string;
    items: Array<{
        id: number;
        transaction_id: number;
        product_name: string;
        quantity: number;
    }>;
};

type HistoryPagination = {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
    data: TransactionHistoryItem[];
};

const periodLabels: Record<Period, string> = {
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
};

const formatDateTime = (dateStr: string) => {
    try {
        const d = new Date(dateStr);
        return (
            new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta',
            }).format(d) + ' WIB'
        );
    } catch {
        return dateStr;
    }
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);

const formatCompactCurrency = (value: number) => {
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp ${Math.round(value / 1_000)}k`;
    return formatCurrency(value);
};

function StatCard({
    label,
    value,
    detail,
    icon,
    tone = 'orange',
}: {
    label: string;
    value: string;
    detail: React.ReactNode;
    icon: React.ReactNode;
    tone?: 'orange' | 'blue' | 'pink';
}) {
    const toneClass = {
        orange: 'bg-[#fff4e8] text-[#f3904f]',
        blue: 'bg-[#eef1ff] text-[#3b4371]',
        pink: 'bg-[#fff0f7] text-[#ee5a9a]',
    }[tone];

    return (
        <article className="rounded-2xl border border-[#eeeae7] bg-white p-5 shadow-[0_3px_15px_rgba(39,52,84,0.03)]">
            <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.04em] text-[#8b8987]">
                    {label}
                </p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClass}`}>
                    {icon}
                </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold tracking-tight text-[#3b4371]">
                {value}
            </p>
            <div className="mt-3 text-xs text-[#8b8987]">{detail}</div>
        </article>
    );
}

export default function SalesReport() {
    const [period, setPeriod] = useState<Period>('daily');
    const [summary, setSummary] = useState<Summary | null>(null);
    const [chart, setChart] = useState<ChartData | null>(null);
    const [categories, setCategories] = useState<CategorySales | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // History states
    const [history, setHistory] = useState<HistoryPagination | null>(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historySearch, setHistorySearch] = useState('');
    const [historyPage, setHistoryPage] = useState(1);

    const handlePeriodChange = (newPeriod: Period) => {
        setPeriod(newPeriod);
        setHistoryPage(1);
    };

    useEffect(() => {
        const controller = new AbortController();
        let isFirstLoad = true;
        let refreshTimer: number | undefined;

        const loadReport = async () => {
            if (document.visibilityState !== 'visible') {
                return;
            }

            if (isFirstLoad) {
                setLoading(true);
                setError(null);
            }

            try {
                const summaryResponse = await fetch(
                    `/laporan-penjualan/summary?period=${period}`,
                    {
                        signal: controller.signal,
                        headers: { Accept: 'application/json' },
                    },
                );

                if (!summaryResponse.ok) {
                    throw new Error('Data laporan tidak dapat dimuat.');
                }

                const summaryData = await summaryResponse.json();
                const chartData = summaryData.chart as ChartData;
                setSummary(summaryData);
                setCategories(summaryData.category_sales);
                setChart(chartData);
                setError(null);

                // Refresh history page 1 quietly if not actively searching
                if (historyPage === 1 && !historySearch.trim()) {
                    void fetch(`/laporan-penjualan/history?period=${period}&page=1`, {
                        signal: controller.signal,
                        headers: { Accept: 'application/json' },
                    })
                        .then((res) => (res.ok ? res.json() : null))
                        .then((data) => {
                            if (data) setHistory(data);
                        })
                        .catch(() => {});
                }
            } catch (requestError) {
                if (
                    requestError instanceof Error &&
                    requestError.name !== 'AbortError'
                ) {
                    setError(requestError.message);
                }
            } finally {
                if (isFirstLoad) {
                    setLoading(false);
                    isFirstLoad = false;
                }
            }
        };

        void loadReport();
        const startRefresh = () => {
            if (refreshTimer === undefined) {
                refreshTimer = window.setInterval(loadReport, 10000);
            }
        };
        const stopRefresh = () => {
            if (refreshTimer !== undefined) {
                window.clearInterval(refreshTimer);
                refreshTimer = undefined;
            }
        };
        startRefresh();
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                startRefresh();
                void loadReport();
            } else {
                stopRefresh();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            controller.abort();
            stopRefresh();
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, [period, historyPage, historySearch]);

    // Effect for loading transaction history with debounced search
    useEffect(() => {
        const controller = new AbortController();
        let isCancelled = false;

        const timer = setTimeout(async () => {
            setHistoryLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    period,
                    page: historyPage.toString(),
                });
                if (historySearch.trim()) {
                    queryParams.set('search', historySearch.trim());
                }

                const response = await fetch(
                    `/laporan-penjualan/history?${queryParams.toString()}`,
                    {
                        signal: controller.signal,
                        headers: { Accept: 'application/json' },
                    },
                );

                if (!response.ok) {
                    throw new Error('Gagal memuat riwayat transaksi.');
                }

                const data = await response.json();
                if (!isCancelled) {
                    setHistory(data);
                }
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error('Error fetching transaction history:', err);
                }
            } finally {
                if (!isCancelled) {
                    setHistoryLoading(false);
                }
            }
        }, 300);

        return () => {
            isCancelled = true;
            controller.abort();
            clearTimeout(timer);
        };
    }, [period, historyPage, historySearch]);

    const values = chart?.datasets[0]?.data ?? [];
    const maxValue = Math.max(...values, 1);
    const peakIndex = chart?.peak.label
        ? chart.labels.indexOf(chart.peak.label)
        : -1;
    const categoryGradient = useMemo(() => {
        const colors = ['#3b4371', '#f3904f', '#f7a4b9', '#8cc8c2'];
        let current = 0;
        return (categories?.categories ?? []).map((category, index) => {
            const start = current;
            current += category.percentage;
            return `${colors[index % colors.length]} ${start}% ${current}%`;
        });
    }, [categories]);

    const pdfUrl = `/laporan-penjualan/pdf?period=${period}`;

    return (
        <>
            <Head title="Laporan Penjualan - Mochimod" />
            <main className="min-h-[calc(100vh-64px)] overflow-x-hidden bg-[#faf9f7] px-3 py-4 sm:px-5 sm:py-6 lg:px-10">
                <section className="mx-auto max-w-[1400px]">
                    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#eeeae7] bg-white p-4 sm:p-5 lg:flex-row lg:items-center lg:px-6">
                        <div className="min-w-0">
                            <h1 className="text-lg font-extrabold tracking-tight text-[#3b4371] sm:text-xl lg:text-2xl">
                                Laporan Penjualan &amp; Performa Kasir
                            </h1>
                            <p className="mt-1 text-xs text-[#8b8987]">
                                Pantau performa penjualan Mochimod secara berkala.
                            </p>
                        </div>
                        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                            <div className="flex min-w-0 flex-1 rounded-xl bg-[#f7f6f4] p-1 sm:flex-none">
                                {(Object.keys(periodLabels) as Period[]).map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => handlePeriodChange(item)}
                                        className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold transition sm:flex-none sm:px-3 ${
                                            period === item
                                                ? 'bg-[#f3904f] text-white shadow-sm'
                                                : 'text-[#6f6c68] hover:text-[#3b4371]'
                                        }`}
                                    >
                                        {periodLabels[item]}
                                    </button>
                                ))}
                            </div>
                            <a
                                href={pdfUrl}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#dedbd8] px-3 py-2 text-xs font-bold text-[#4c4a48] transition hover:border-[#f3904f] hover:text-[#f3904f] sm:flex-none sm:px-4"
                            >
                                <span aria-hidden="true">↓</span> Download PDF
                            </a>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className={`mt-4 grid gap-3 sm:mt-5 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4 ${loading ? 'animate-pulse' : ''}`}>
                        <StatCard
                            label={`Total Penjualan ${summary?.period_label ?? periodLabels[period]}`}
                            value={formatCurrency(summary?.total_revenue ?? 0)}
                            detail={
                                <span className="font-bold text-emerald-600">
                                    ↑ {summary?.growth_percentage ?? 0}% vs periode sebelumnya
                                </span>
                            }
                            tone="orange"
                            icon={<span className="text-sm font-extrabold">Rp</span>}
                        />
                        <StatCard
                            label="Total Transaksi"
                            value={`${summary?.total_transactions ?? 0} Struk`}
                            detail={
                                <span>
                                    Rata-rata ticket{' '}
                                    <strong className="float-right rounded-md bg-[#f3f4fb] px-2 py-1 text-[#3b4371]">
                                        {formatCurrency(summary?.avg_ticket ?? 0)}/struk
                                    </strong>
                                </span>
                            }
                            tone="blue"
                            icon={<span className="text-sm">▧</span>}
                        />
                        <StatCard
                            label="Metode Pembayaran"
                            value=""
                            detail={
                                <div className="-mt-2">
                                    <div className="mb-2 flex h-2 overflow-hidden rounded-full bg-[#f0efed]">
                                        <span
                                            className="bg-[#3b4371]"
                                            style={{ width: `${summary?.payment_methods.qris.percentage ?? 0}%` }}
                                        />
                                        <span
                                            className="bg-[#f3904f]"
                                            style={{ width: `${summary?.payment_methods.cash.percentage ?? 0}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="font-bold text-[#3b4371]">● QRIS {summary?.payment_methods.qris.percentage ?? 0}%</span>
                                        <span className="font-bold text-[#f3904f]">● Tunai {summary?.payment_methods.cash.percentage ?? 0}%</span>
                                    </div>
                                </div>
                            }
                            tone="orange"
                            icon={<span className="text-sm">▤</span>}
                        />
                        <StatCard
                            label="Produk Terlaris"
                            value={summary?.top_products[0]?.product_name ?? '-'}
                            detail={
                                <span className="flex justify-between">
                                    <span>🥇 {summary?.top_products[0]?.total_qty ?? 0} pcs terjual</span>
                                    <span>🥈 {summary?.top_products[1]?.product_name ?? '-'}</span>
                                </span>
                            }
                            tone="pink"
                            icon={<span className="text-sm">♧</span>}
                        />
                    </div>

                    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(330px,1fr)]">
                        <section className="min-w-0 rounded-2xl border border-[#eeeae7] bg-white p-4 sm:p-6">
                            <div className="flex flex-col items-start gap-2 border-b border-[#f0eeec] pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-sm font-extrabold text-[#3b4371] sm:text-base">
                                    Grafik Penjualan {period === 'daily' ? 'Per Jam (00:00 - 23:00)' : period === 'weekly' ? 'Per Hari' : 'Per Tanggal'}
                                </h2>
                                <span className="text-[11px] font-semibold text-[#77736f] sm:text-xs">■ Pendapatan (IDR)</span>
                            </div>
                            <div className="mt-4 flex h-[260px] gap-2 sm:mt-5 sm:h-[300px] sm:gap-3">
                                <div className="flex flex-col justify-between py-1 text-[10px] text-[#aaa6a2]">
                                    {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                                        <span key={ratio}>{formatCompactCurrency(maxValue * ratio)}</span>
                                    ))}
                                </div>
                                <div className="no-scrollbar min-w-0 flex-1 overflow-x-auto border-b border-[#ddd9d5]">
                                <div className={`relative flex h-full min-w-full items-end justify-around gap-1 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_24.7%,#efedeb_25%,transparent_25.4%)] px-1 ${values.length > 12 ? 'min-w-[560px] sm:min-w-full' : ''}`}>
                                    {values.map((value, index) => {
                                        const active = index === peakIndex && value > 0;
                                        const showLabel = values.length <= 9 || active;
                                        return (
                                            <div key={`${chart?.labels[index] ?? index}`} className="flex h-full flex-1 flex-col items-center justify-end">
                                                {showLabel && active && (
                                                    <span className="mb-1 rounded-md bg-[#3b4371] px-2 py-1 text-[10px] font-bold text-white">
                                                        {formatCompactCurrency(value)}
                                                    </span>
                                                )}
                                                <div
                                                    className={`w-full max-w-10 rounded-t-lg transition-all ${active ? 'bg-[#3b4371]' : 'bg-[#dfdddb]'}`}
                                                    style={{ height: `${Math.max((value / maxValue) * 88, value > 0 ? 3 : 0)}%` }}
                                                    title={`${chart?.labels[index]}: ${formatCurrency(value)}`}
                                                />
                                                <span className={`mt-2 max-w-14 truncate text-[10px] ${active ? 'font-bold text-[#3b4371]' : 'text-[#77736f]'}`}>
                                                    {chart?.labels[index]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                </div>
                            </div>
                        </section>

                        <section className="min-w-0 rounded-2xl border border-[#eeeae7] bg-white p-4 sm:p-6">
                            <div className="flex items-center justify-between border-b border-[#f0eeec] pb-4">
                                <h2 className="text-sm font-extrabold text-[#3b4371] sm:text-base">Porsi Kategori Terjual</h2>
                                <span className="text-[#aaa6a2]">•••</span>
                            </div>
                            <div className="flex flex-col items-center gap-5 py-5">
                                <div
                                    className="relative flex h-40 w-40 items-center justify-center rounded-full"
                                    style={{ background: categoryGradient.length ? `conic-gradient(${categoryGradient.join(', ')})` : '#e8e6e4' }}
                                >
                                    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                                        <strong className="text-2xl text-[#3b4371]">{categories?.total_qty ?? 0}</strong>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#aaa6a2]">pcs total</span>
                                    </div>
                                </div>
                                <div className="w-full space-y-3">
                                    {(categories?.categories ?? []).map((category, index) => {
                                        const categoryColors = [
                                            'bg-[#3b4371]',
                                            'bg-[#f3904f]',
                                            'bg-[#f7a4b9]',
                                            'bg-[#8cc8c2]',
                                        ];
                                        const color = categoryColors[index % categoryColors.length];

                                        return (
                                        <div key={category.name}>
                                            <div className="flex justify-between text-xs font-semibold text-[#55514d]">
                                                <span><i className={`mr-2 inline-block h-2 w-2 rounded-sm ${color}`} />{category.name}</span>
                                                <span>{category.percentage}% <small className="font-normal text-[#aaa6a2]">({category.qty} pcs)</small></span>
                                            </div>
                                            <div className="mt-1 h-1.5 rounded-full bg-[#f0efed]">
                                                <div className={`h-full rounded-full ${color}`} style={{ width: `${category.percentage}%` }} />
                                            </div>
                                        </div>
                                        );
                                    })}
                                    {!categories?.categories.length && <p className="text-center text-xs text-[#aaa6a2]">Belum ada data kategori.</p>}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Riwayat Transaksi Section */}
                    <section className="mt-5 rounded-2xl border border-[#eeeae7] bg-white p-4 sm:p-6 shadow-[0_3px_15px_rgba(39,52,84,0.03)]">
                        <div className="flex flex-col gap-3 border-b border-[#f0eeec] pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-sm font-extrabold text-[#3b4371] sm:text-base">
                                    Riwayat Transaksi {periodLabels[period]}
                                </h2>
                                <p className="mt-0.5 text-xs text-[#8b8987]">
                                    Daftar rincian struk transaksi yang berhasil diselesaikan ({history?.total ?? 0} transaksi).
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari kode / nama menu..."
                                        value={historySearch}
                                        onChange={(e) => {
                                            setHistorySearch(e.target.value);
                                            setHistoryPage(1);
                                        }}
                                        className="w-full rounded-xl border border-[#dedbd8] bg-[#faf9f7] px-3 py-1.5 pl-8 pr-7 text-xs text-[#3b4371] placeholder-[#aaa6a2] focus:border-[#f3904f] focus:bg-white focus:outline-none sm:w-64"
                                    />
                                    <svg
                                        className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#aaa6a2]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    {historySearch && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setHistorySearch('');
                                                setHistoryPage(1);
                                            }}
                                            className="absolute right-2.5 top-1.5 text-xs text-[#aaa6a2] hover:text-[#3b4371]"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="mt-4 overflow-x-auto no-scrollbar">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#f0eeec] bg-[#faf9f7] text-[11px] font-bold text-[#8b8987] uppercase tracking-wider">
                                        <th className="py-3 px-4 text-center w-12">No</th>
                                        <th className="py-3 px-4">Kode Transaksi</th>
                                        <th className="py-3 px-4">Waktu (WIB)</th>
                                        <th className="py-3 px-4 text-center">Metode</th>
                                        <th className="py-3 px-4">Item Pembelian</th>
                                        <th className="py-3 px-4 text-right">Total Tagihan</th>
                                        <th className="py-3 px-4 text-center w-28">Struk</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f5f4f2] text-xs">
                                    {historyLoading ? (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-[#8b8987]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3904f] border-t-transparent" />
                                                    <span>Memuat data transaksi...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : !history?.data.length ? (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-[#8b8987]">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <span className="text-2xl">📋</span>
                                                    <p className="font-semibold text-[#55514d]">
                                                        Belum ada transaksi pada periode ini
                                                    </p>
                                                    <p className="text-[11px] text-[#aaa6a2]">
                                                        Transaksi yang diselesaikan kasir akan muncul di sini secara otomatis.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        history.data.map((trx, index) => {
                                            const rowNumber = (history.current_page - 1) * history.per_page + index + 1;
                                            const isCash = trx.payment_method?.toLowerCase() === 'cash';

                                            return (
                                                <tr key={trx.id} className="transition-colors hover:bg-[#faf9f7]">
                                                    <td className="py-3 px-4 text-center text-[#8b8987]">{rowNumber}</td>
                                                    <td className="py-3 px-4 font-bold text-[#3b4371]">
                                                        {trx.transaction_code}
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap text-[#55514d]">
                                                        {formatDateTime(trx.created_at)}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span
                                                            className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${
                                                                isCash
                                                                    ? 'bg-[#fff4e8] text-[#f3904f] border border-[#ffe3cc]'
                                                                    : 'bg-[#eef1ff] text-[#3b4371] border border-[#dbe2ff]'
                                                            }`}
                                                        >
                                                            {isCash ? 'Tunai' : 'QRIS'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 max-w-xs truncate text-[#55514d]" title={trx.items?.map((it) => `${it.quantity}x ${it.product_name}`).join(', ')}>
                                                        {trx.items && trx.items.length > 0
                                                            ? trx.items.map((it) => `${it.quantity}x ${it.product_name}`).join(', ')
                                                            : '-'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-extrabold text-[#3b4371]">
                                                        {formatCurrency(Number(trx.total_amount))}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <a
                                                            href={`/checkout/${trx.id}/receipt/pdf`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 rounded-lg border border-[#dedbd8] px-2 py-1 text-[11px] font-semibold text-[#55514d] hover:border-[#f3904f] hover:text-[#f3904f] transition"
                                                        >
                                                            <span>📄 Nota</span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination footer */}
                        {history && history.last_page > 1 && (
                            <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-[#f0eeec] pt-3 sm:flex-row text-xs text-[#8b8987]">
                                <div>
                                    Menampilkan {history.from ?? 0} - {history.to ?? 0} dari {history.total} transaksi
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={history.current_page <= 1 || historyLoading}
                                        onClick={() => setHistoryPage((p) => Math.max(p - 1, 1))}
                                        className="rounded-lg border border-[#dedbd8] px-3 py-1 font-bold text-[#55514d] hover:border-[#f3904f] hover:text-[#f3904f] disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        Sebelumnya
                                    </button>
                                    <span className="px-2 font-semibold text-[#3b4371]">
                                        {history.current_page} / {history.last_page}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={history.current_page >= history.last_page || historyLoading}
                                        onClick={() => setHistoryPage((p) => Math.min(p + 1, history.last_page))}
                                        className="rounded-lg border border-[#dedbd8] px-3 py-1 font-bold text-[#55514d] hover:border-[#f3904f] hover:text-[#f3904f] disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        Berikutnya
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </section>
            </main>
        </>
    );
}

SalesReport.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
