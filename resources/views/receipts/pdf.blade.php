<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Struk Pembayaran - {{ $transaction->transaction_code }}</title>
    <style>
        @page {
            margin: 10mm 12mm;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            color: #222222;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }

        .receipt-container {
            width: 100%;
            max-width: 480px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 8px;
        }

        .store-name {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 3px;
        }

        .store-info {
            font-size: 10px;
            color: #555555;
            margin-bottom: 2px;
        }

        .divider {
            border-top: 1px dashed #777777;
            margin: 8px 0;
        }

        .divider-double {
            border-top: 2px solid #333333;
            margin: 8px 0;
        }

        .meta-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }

        .meta-table td {
            padding: 2px 0;
            vertical-align: top;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 4px 0;
        }

        .items-table th {
            text-align: left;
            font-size: 10px;
            font-weight: bold;
            padding: 5px 0;
            border-bottom: 1px solid #444444;
            text-transform: uppercase;
        }

        .items-table td {
            padding: 4px 0;
            font-size: 10.5px;
            vertical-align: top;
        }

        .totals-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }

        .totals-table td {
            padding: 2px 0;
        }

        .text-left {
            text-align: left;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .font-bold {
            font-weight: bold;
        }

        .total-highlight {
            font-size: 12px;
            font-weight: bold;
        }

        .footer {
            text-align: center;
            margin-top: 14px;
            font-size: 10px;
            color: #444444;
        }

        .footer-thanks {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 4px;
        }

        .notes-box {
            margin-top: 6px;
            padding: 4px 6px;
            background-color: #f7f7f7;
            font-size: 9.5px;
            border-left: 2px solid #888888;
        }
    </style>
</head>
<body>
    @php
        $namaToko = $storeName ?? $store_name ?? config('app.store_name', 'Mochimod');
        $alamatToko = $storeAddress ?? $store_address ?? config('app.store_address', '');
        $teleponToko = $storePhone ?? $store_phone ?? config('app.store_phone', '');

        // Format tanggal & waktu (WIB)
        $createdAt = $transaction->created_at ? \Carbon\Carbon::parse($transaction->created_at)->timezone('Asia/Jakarta') : now()->timezone('Asia/Jakarta');
        $tanggal = $createdAt->translatedFormat('d F Y');
        $pukul = $createdAt->format('H:i') . ' WIB';

        // Nama kasir
        $namaKasir = $transaction->user?->name ?? 'Kasir';

        // Label metode pembayaran
        $metodeBayar = match(strtolower($transaction->payment_method ?? '')) {
            'cash' => 'Tunai',
            'qris' => 'QRIS',
            'transfer' => 'Transfer Bank',
            default => ucfirst($transaction->payment_method ?? '-')
        };
    @endphp

    <div class="receipt-container">
        <!-- HEADER TOKO -->
        <div class="header">
            <div class="store-name">{{ $namaToko }}</div>
            @if(!empty($alamatToko))
                <div class="store-info">{{ $alamatToko }}</div>
            @endif
            @if(!empty($teleponToko))
                <div class="store-info">Telp: {{ $teleponToko }}</div>
            @endif
        </div>

        <div class="divider"></div>

        <!-- INFO TRANSAKSI -->
        <table class="meta-table">
            <tr>
                <td style="width: 25%;">No. Nota</td>
                <td style="width: 3%;">:</td>
                <td style="width: 72%;" class="font-bold">{{ $transaction->transaction_code }}</td>
            </tr>
            <tr>
                <td>Tanggal</td>
                <td>:</td>
                <td>{{ $tanggal }}</td>
            </tr>
            <tr>
                <td>Pukul</td>
                <td>:</td>
                <td>{{ $pukul }}</td>
            </tr>
            <tr>
                <td>Kasir</td>
                <td>:</td>
                <td>{{ $namaKasir }}</td>
            </tr>
        </table>

        <div class="divider"></div>

        <!-- TABEL ITEM PESANAN -->
        <table class="items-table">
            <thead>
                <tr>
                    <th class="text-left" style="width: 48%;">ITEM</th>
                    <th class="text-center" style="width: 14%;">QTY</th>
                    <th class="text-right" style="width: 18%;">HARGA</th>
                    <th class="text-right" style="width: 20%;">SUBTOTAL</th>
                </tr>
            </thead>
            <tbody>
                @forelse($transaction->items as $item)
                    <tr>
                        <td class="text-left font-bold">{{ $item->product_name }}</td>
                        <td class="text-center">{{ $item->quantity }}</td>
                        <td class="text-right">{{ number_format((float) $item->product_price, 0, ',', '.') }}</td>
                        <td class="text-right">{{ number_format((float) $item->subtotal, 0, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="text-center" style="padding: 8px 0; color: #888;">Tidak ada item</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="divider"></div>

        <!-- RINGKASAN PEMBAYARAN -->
        <table class="totals-table">
            <tr class="total-highlight">
                <td class="text-left" style="width: 60%;">TOTAL</td>
                <td class="text-right" style="width: 40%;">Rp {{ number_format((float) $transaction->total_amount, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="text-left">Metode Bayar</td>
                <td class="text-right">{{ $metodeBayar }}</td>
            </tr>
            @if(strtolower($transaction->payment_method ?? '') === 'cash' || (float) $transaction->amount_paid > 0)
                <tr>
                    <td class="text-left">Uang Bayar</td>
                    <td class="text-right">Rp {{ number_format((float) $transaction->amount_paid, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td class="text-left">Kembalian</td>
                    <td class="text-right">Rp {{ number_format((float) $transaction->change_amount, 0, ',', '.') }}</td>
                </tr>
            @endif
        </table>

        @if(!empty($transaction->notes))
            <div class="notes-box">
                <strong>Catatan:</strong> {{ $transaction->notes }}
            </div>
        @endif

        <div class="divider"></div>

        <!-- FOOTER -->
        <div class="footer">
            <div class="footer-thanks">Terima kasih sudah berbelanja!</div>
            <div>Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.</div>
        </div>
    </div>
</body>
</html>
