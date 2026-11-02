<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('transaction_items', 'category_name')) {
            Schema::table('transaction_items', function (Blueprint $table) {
                $table->string('category_name', 255)->nullable()->after('product_name');
            });
        }

        DB::statement('
            UPDATE transaction_items
            SET category_name = (
                SELECT categories.name
                FROM products
                INNER JOIN categories ON categories.id = products.category_id
                WHERE products.id = transaction_items.product_id
            )
            WHERE category_name IS NULL
        ');
    }

    public function down(): void
    {
        if (Schema::hasColumn('transaction_items', 'category_name')) {
            Schema::table('transaction_items', function (Blueprint $table) {
                $table->dropColumn('category_name');
            });
        }
    }
};
