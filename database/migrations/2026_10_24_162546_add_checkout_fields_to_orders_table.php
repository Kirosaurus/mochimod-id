<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('status')
                ->default('pending');

            $table->string('payment_method')
                ->nullable();

            $table->decimal('subtotal', 12, 2)
                ->default(0);

            $table->decimal('total', 12, 2)
                ->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn([
                'status',
                'payment_method',
                'subtotal',
                'total',
            ]);
        });
    }
};