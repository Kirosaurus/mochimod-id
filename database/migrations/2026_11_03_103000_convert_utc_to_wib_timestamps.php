<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();
        $cutoff = '2026-11-03 10:28:00';

        if (in_array($driver, ['mysql', 'mariadb'])) {
            DB::statement("
                UPDATE transactions
                SET created_at = DATE_ADD(created_at, INTERVAL 7 HOUR),
                    updated_at = DATE_ADD(updated_at, INTERVAL 7 HOUR)
                WHERE created_at < ?
            ", [$cutoff]);

            DB::statement("
                UPDATE transaction_items
                SET created_at = DATE_ADD(created_at, INTERVAL 7 HOUR),
                    updated_at = DATE_ADD(updated_at, INTERVAL 7 HOUR)
                WHERE created_at < ?
            ", [$cutoff]);
        } elseif ($driver === 'sqlite') {
            DB::statement("
                UPDATE transactions
                SET created_at = datetime(created_at, '+7 hours'),
                    updated_at = datetime(updated_at, '+7 hours')
                WHERE created_at < ?
            ", [$cutoff]);

            DB::statement("
                UPDATE transaction_items
                SET created_at = datetime(created_at, '+7 hours'),
                    updated_at = datetime(updated_at, '+7 hours')
                WHERE created_at < ?
            ", [$cutoff]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();
        $cutoff = '2026-11-03 17:28:00';

        if (in_array($driver, ['mysql', 'mariadb'])) {
            DB::statement("
                UPDATE transactions
                SET created_at = DATE_SUB(created_at, INTERVAL 7 HOUR),
                    updated_at = DATE_SUB(updated_at, INTERVAL 7 HOUR)
                WHERE created_at <= ?
            ", [$cutoff]);

            DB::statement("
                UPDATE transaction_items
                SET created_at = DATE_SUB(created_at, INTERVAL 7 HOUR),
                    updated_at = DATE_SUB(updated_at, INTERVAL 7 HOUR)
                WHERE created_at <= ?
            ", [$cutoff]);
        } elseif ($driver === 'sqlite') {
            DB::statement("
                UPDATE transactions
                SET created_at = datetime(created_at, '-7 hours'),
                    updated_at = datetime(updated_at, '-7 hours')
                WHERE created_at <= ?
            ", [$cutoff]);

            DB::statement("
                UPDATE transaction_items
                SET created_at = datetime(created_at, '-7 hours'),
                    updated_at = datetime(updated_at, '-7 hours')
                WHERE created_at <= ?
            ", [$cutoff]);
        }
    }
};
