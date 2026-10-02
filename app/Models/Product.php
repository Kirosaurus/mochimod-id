<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

#[Fillable(
    "category_id",
    "name",
    "stock",
    "price",
    "image",
    "is_active"
)]
class Product extends Model
{
    #[Override]
    protected function casts()
    {
        return [
            "price" => "decimal:2",
            "is_active" => "boolean"
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
