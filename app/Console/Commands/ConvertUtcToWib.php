<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ConvertUtcToWib extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:convert-utc-to-wib {--cutoff=2026-11-03 10:28:00 : Batas waktu maksimal record UTC yang dikonversi}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mengonversi created_at dan updated_at transaksi historis yang tercatat dalam UTC menjadi WIB (+7 jam)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $cutoff = $this->option('cutoff');
        $driver = DB::getDriverName();

        $this->info("Menjalankan konversi timestamp UTC ke WIB (cutoff: {$cutoff})...");

        if (in_array($driver, ['mysql', 'mariadb'])) {
            $updatedTrx = DB::update("
                UPDATE transactions
                SET created_at = DATE_ADD(created_at, INTERVAL 7 HOUR),
                    updated_at = DATE_ADD(updated_at, INTERVAL 7 HOUR)
                WHERE created_at < ?
            ", [$cutoff]);

            $updatedItems = DB::update("
                UPDATE transaction_items
                SET created_at = DATE_ADD(created_at, INTERVAL 7 HOUR),
                    updated_at = DATE_ADD(updated_at, INTERVAL 7 HOUR)
                WHERE created_at < ?
            ", [$cutoff]);
        } elseif ($driver === 'sqlite') {
            $updatedTrx = DB::update("
                UPDATE transactions
                SET created_at = datetime(created_at, '+7 hours'),
                    updated_at = datetime(updated_at, '+7 hours')
                WHERE created_at < ?
            ", [$cutoff]);

            $updatedItems = DB::update("
                UPDATE transaction_items
                SET created_at = datetime(created_at, '+7 hours'),
                    updated_at = datetime(updated_at, '+7 hours')
                WHERE created_at < ?
            ", [$cutoff]);
        } else {
            $this->error("Database driver [{$driver}] belum didukung.");
            return Command::FAILURE;
        }

        $this->info("Berhasil mengonversi {$updatedTrx} transaksi dan {$updatedItems} item transaksi ke WIB (+7 jam).");

        return Command::SUCCESS;
    }
}
