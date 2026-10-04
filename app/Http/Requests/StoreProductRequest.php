<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ['string', 'required', 'max:255'],
            "category_id" => ['required', 'exists:categories,id'],
            "stock" => ['required', 'integer', 'min:0'],
            "price" => ['required', 'numeric', 'min:0.01'],
            "image" => ['nullable', 'string', 'max:2048'],
            'is_active' => ['boolean']
        ];
    }
}
