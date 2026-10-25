<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
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
            'payment_method'     => ['required', 'in:cash,qris'],
            'items'              => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'   => ['required', 'integer', 'min:1'],
            'amount_paid'        => ['required_if:payment_method,cash', 'numeric', 'min:0'],
            'notes'              => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'items.required'            => 'Keranjang belanja tidak boleh kosong.',
            'items.min'                 => 'Minimal harus ada 1 item.',
            'items.*.product_id.exists' => 'Produk tidak ditemukan atau sudah tidak aktif.',
            'amount_paid.required_if'   => 'Jumlah uang yang diterima wajib diisi untuk pembayaran tunai.',
        ];
    }
}
