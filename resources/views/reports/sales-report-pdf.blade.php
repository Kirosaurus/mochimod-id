<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Penjualan - {{ $summary['period_label'] ?? 'Mochimod' }}</title>
    <style>
        @page {
            margin: 12mm 15mm;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            color: #222222;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #333333;
            padding-bottom: 10px;
        }

        .store-name {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #111111;
        }

        .report-title {
            font-size: 13px;
            font-weight: bold;
            margin-top: 4px;
            color: #444444;
            text-transform: uppercase;
        }

        .period-info {
            font-size: 10px;
            color: #666666;
            margin-top: 2px;
        }

        .section-title {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1.5px solid #555555;
            padding-bottom: 3px;
            margin-top: 14px;
            margin-bottom: 8px;
            color: #222222;
        }

        .summary-cards {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .summary-cards td {
            width: 25%;
            padding: 8px;
            background-color: #f8f9fa;
            border: 1px solid #e2e8f0;
            vertical-align: top;
        }

        .card-label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 4px;
        }

        .card-value {
            font-size: 13px;
            font-weight: bold;
            color: #0f172a;
        }

        .card-subtext {
            font-size: 8.5px;
            color: #64748b;
            margin-top: 2px;
        }

        .growth-positive {
            color: #16a34a;
        }

        .growth-negative {
            color: #dc2626;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            margin-bottom: 10px;
        }

        .data-table th {
            background-color: #f1f5f9;
            color: #334155;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            padding: 6px 8px;
            border: 1px solid #cbd5e1;
            text-align: left;
        }

        .data-table td {
            padding: 5px 8px;
            border: 1px solid #e2e8f0;
            font-size: 9.5px;
            vertical-align: top;
        }

        .data-table tr:nth-child(even) {
            background-color: #fcfcfc;
        }

        .two-columns {
            width: 100%;
            border-collapse: collapse;
        }

        .two-columns td {
            width: 50%;
            vertical-align: top;
            padding: 0;
        }

        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }

        .badge {
            display: inline-block;
            padding: 2px 5px;
            font-size: 8px;
            font-weight: bold;
            border-radius: 3px;
            text-transform: uppercase;
        }

        .badge-qris {
            background-color: #e0f2fe;
            color: #0369a1;
        }

        .badge-cash {
            background-color: #f0fdf4;
            color: #15803d;
        }

        .footer {
            margin-top: 20px;
            border-top: 1px solid #cbd5e1;
            padding-top: 8px;
            font-size: 8.5px;
            color: #64748b;
            text-align: center;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    @php
        $namaToko = $store_name ?? 'Mochimod';
        $alamatToko = $store_address ?? '';
        $teleponToko = $store_phone ?? '';
        $rentangTanggal = $startDate->translatedFormat('d M Y') . ' - ' . $endDate->translatedFormat('d M Y');
        $growth = $summary['growth_percentage'] ?? 0;
    @endphp

    <!-- HEADER LAPORAN -->
    <div class="header">
        <div class="store-name">{{ $namaToko }}</div>
        @if(!empty($alamatToko) || !empty($teleponToko))
            <div class="period-info">{{ $alamatToko }} {{ !empty($teleponToko) ? '| Telp: ' . $teleponToko : '' }}</div>
        @endif
        <div class="report-title">Laporan Penjualan ({{ ucfirst($period) }})</div>
        <div class="period-info">Rentang Tanggal: <strong>{{ $rentangTanggal }}</strong> | Label: <strong>{{ $summary['period_label'] ?? '-' }}</strong></div>
    </div>

    <!-- RINGKASAN METRIK UTAMA (SUMMARY CARDS) -->
    <table class="summary-cards">
        <tr>
            <td>
                <div class="card-label">Total Omset</div>
                <div class="card-value">Rp {{ number_format($summary['total_revenue'] ?? 0, 0, ',', '.') }}</div>
                <div class="card-subtext {{ $growth >= 0 ? 'growth-positive' : 'growth-negative' }}">
                    {{ $growth >= 0 ? '+' : '' }}{{ $growth }}% vs periode lalu
                </div>
            </td>
            <td>
                <div class="card-label">Total Transaksi</div>
                <div class="card-value">{{ number_format($summary['total_transactions'] ?? 0, 0, ',', '.') }}</div>
                <div class="card-subtext">Transaksi Selesai</div>
            </td>
            <td>
                <div class="card-label">Rata-rata Tiket (Avg)</div>
                <div class="card-value">Rp {{ number_format($summary['avg_ticket'] ?? 0, 0, ',', '.') }}</div>
                <div class="card-subtext">Per Transaksi</div>
            </td>
            <td>
                <div class="card-label">Titik Puncak (Peak)</div>
                <div class="card-value">{{ $chartData['peak']['label'] ?? '-' }}</div>
                <div class="card-subtext">
                    @if(!empty($chartData['peak']['value']))
                        Rp {{ number_format($chartData['peak']['value'], 0, ',', '.') }}
                    @else
                        Tidak ada penjualan
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <!-- METODE PEMBAYARAN -->
    <div class="section-title">Metode Pembayaran</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 25%;">Metode</th>
                <th class="text-right" style="width: 30%;">Total Nominal</th>
                <th class="text-center" style="width: 20%;">Jumlah Transaksi</th>
                <th class="text-center" style="width: 25%;">Persentase Omset</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="font-bold"><span class="badge badge-qris">QRIS</span></td>
                <td class="text-right">Rp {{ number_format($summary['payment_methods']['qris']['amount'] ?? 0, 0, ',', '.') }}</td>
                <td class="text-center">{{ $summary['payment_methods']['qris']['count'] ?? 0 }} trx</td>
                <td class="text-center font-bold">{{ $summary['payment_methods']['qris']['percentage'] ?? 0 }}%</td>
            </tr>
            <tr>
                <td class="font-bold"><span class="badge badge-cash">Tunai (Cash)</span></td>
                <td class="text-right">Rp {{ number_format($summary['payment_methods']['cash']['amount'] ?? 0, 0, ',', '.') }}</td>
                <td class="text-center">{{ $summary['payment_methods']['cash']['count'] ?? 0 }} trx</td>
                <td class="text-center font-bold">{{ $summary['payment_methods']['cash']['percentage'] ?? 0 }}%</td>
            </tr>
        </tbody>
    </table>

    <!-- DUA KOLOM: PRODUK TERLARIS & KATEGORI -->
    <table class="two-columns">
        <tr>
            <td style="padding-right: 8px;">
                <div class="section-title">Produk Terlaris</div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th class="text-center" style="width: 18%;">Rank</th>
                            <th style="width: 57%;">Nama Produk</th>
                            <th class="text-right" style="width: 25%;">Terjual</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($summary['top_products'] ?? [] as $top)
                            <tr>
                                <td class="text-center font-bold">#{{ $top['rank'] }}</td>
                                <td>{{ $top['product_name'] }}</td>
                                <td class="text-right font-bold">{{ $top['total_qty'] }} pcs</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="text-center" style="color: #888;">Belum ada data</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </td>
            <td style="padding-left: 8px;">
                <div class="section-title">Penjualan Per Kategori</div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 55%;">Kategori</th>
                            <th class="text-right" style="width: 25%;">Qty</th>
                            <th class="text-center" style="width: 20%;">Porsi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($categorySales['categories'] ?? [] as $cat)
                            <tr>
                                <td>{{ $cat['name'] }}</td>
                                <td class="text-right">{{ $cat['qty'] }} pcs</td>
                                <td class="text-center font-bold">{{ $cat['percentage'] }}%</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="text-center" style="color: #888;">Belum ada data</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </td>
        </tr>
    </table>

    <!-- TABEL DISTRIBUSI WAKTU (DARI CHART DATA) -->
    <div class="section-title">Distribusi Pendapatan ({{ ucfirst($period) }})</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 50%;">Waktu / Tanggal</th>
                <th class="text-right" style="width: 50%;">Pendapatan (IDR)</th>
            </tr>
        </thead>
        <tbody>
            @php
                $chartLabels = $chartData['labels'] ?? [];
                $chartValues = $chartData['datasets'][0]['data'] ?? [];
            @endphp
            @foreach($chartLabels as $idx => $label)
                @if(($chartValues[$idx] ?? 0) > 0 || count($chartLabels) <= 12)
                    <tr>
                        <td>{{ $label }}</td>
                        <td class="text-right font-bold">Rp {{ number_format($chartValues[$idx] ?? 0, 0, ',', '.') }}</td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>

    <!-- RIWAYAT TRANSAKSI (SEMUA TRANSAKSI SELESAI KHUSUS PDF) -->
    <div class="section-title">Riwayat Transaksi (Total: {{ count($transactions) }})</div>
    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" style="width: 6%;">No</th>
                <th style="width: 22%;">Kode Trx</th>
                <th style="width: 18%;">Waktu</th>
                <th class="text-center" style="width: 12%;">Metode</th>
                <th style="width: 27%;">Item Pembelian</th>
                <th class="text-right" style="width: 15%;">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transactions as $index => $trx)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="font-bold">{{ $trx->transaction_code }}</td>
                    <td>{{ \Carbon\Carbon::parse($trx->created_at)->timezone('Asia/Jakarta')->format('d/m/Y H:i') }}</td>
                    <td class="text-center">
                        <span class="badge {{ strtolower($trx->payment_method) === 'qris' ? 'badge-qris' : 'badge-cash' }}">
                            {{ strtoupper($trx->payment_method) }}
                        </span>
                    </td>
                    <td>
                        @foreach($trx->items as $item)
                            <div>{{ $item->product_name }} (x{{ $item->quantity }})</div>
                        @endforeach
                    </td>
                    <td class="text-right font-bold">Rp {{ number_format((float) $trx->total_amount, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center" style="color: #888; padding: 10px;">Tidak ada riwayat transaksi pada periode ini</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- FOOTER LAPORAN -->
    <div class="footer">
        Dicetak otomatis oleh Sistem POS Mochimod pada {{ now()->timezone('Asia/Jakarta')->translatedFormat('d F Y H:i:s') }} WIB
    </div>
</body>
</html>
