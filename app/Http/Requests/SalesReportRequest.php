<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SalesReportRequest extends FormRequest
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
            'period' => ['required', 'in:daily,weekly,monthly'],
            'date' => ['nullable', 'date'],
            'search' => ['nullable', 'string'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
