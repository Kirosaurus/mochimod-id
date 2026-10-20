<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;

#[Fillable(
    'transaction_code',
    'user_id',
    'payment_method',
    'total_amount',
    'amount_paid',
    'change_amount',
    'status',
    'notes'
)]
class Transaction extends Model
{
    #[Override]
    public function casts()
    {
        return [
            'total_amount'=> 'decimal:2',
            'amount_paid' => 'decimal:2',
            'change_amount' => 'decimal:2'
        ];
    }

    // Relations
    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Generate Code
    public static function generateCode(): string
    {
        $prefix = 'TRX-' . date('Ymd') . '-';
        $lastTransaction = self::where('transaction_code', 'like', $prefix . '%')
            ->orderByDesc('id')
            ->first();

        $nextNumber = 1;
        if ($lastTransaction) {
            $lastCode = $lastTransaction->transaction_code;
            $lastNumber = (int) substr($lastCode, strrpos($lastCode, '-') + 1);
            $nextNumber = $lastNumber + 1;
        }

        return $prefix . str_pad((string) $nextNumber, 4, '0', STR_PAD_LEFT);
    }

}
