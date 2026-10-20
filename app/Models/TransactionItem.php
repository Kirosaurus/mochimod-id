<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

#[Fillable(
    'transaction_id',
    'product_id',
    'product_name',
    'product_price',
    'quantity',
    'subtotal'
)]
class TransactionItem extends Model
{
    #[Override]
    public function casts()
    {
        return [
            'product_price' => 'decimal:2',
            'subtotal' => 'decimal:2'
        ];
    }

    // Relations
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
