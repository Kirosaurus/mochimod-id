<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
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
        DB::table('transaction_items')->update(['category_name' => null]);
    }
};
