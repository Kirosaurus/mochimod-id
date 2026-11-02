import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Category, Product } from "@/types";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    productToEdit?: Product | null;
}

export default function ProductModal({
    isOpen,
    onClose,
    categories,
    productToEdit,
}: ProductModalProps) {
    const isEditMode = !!productToEdit;
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            name: string;
            category_id: number | string;
            price: number | string;
            stock: number | string;
            image: File | null;
            is_active: boolean;
            _method?: string;
        }>({
            name: "",
            category_id: categories[0]?.id || "",
            price: "",
            stock: "",
            image: null,
            is_active: true,
        });

    useEffect(() => {
        if (productToEdit) {
            setData({
                name: productToEdit.name,
                category_id: productToEdit.category_id,
                price: parseFloat(productToEdit.price) || 0,
                stock: productToEdit.stock,
                image: null,
                is_active: productToEdit.is_active,
                _method: "PUT",
            });
            if (productToEdit.image) {
                setImagePreview(
                    productToEdit.image.startsWith("http")
                        ? productToEdit.image
                        : `/storage/${productToEdit.image}`
                );
            } else {
                setImagePreview(null);
            }
        } else {
            reset();
            setData({
                name: "",
                category_id: categories[0]?.id || "",
                price: "",
                stock: "",
                image: null,
                is_active: true,
            });
            setImagePreview(null);
        }
        clearErrors();
    }, [productToEdit, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode && productToEdit) {
            // Use POST with _method=PUT to support multipart/form-data for file uploads in PHP
            post(`/products/${productToEdit.id}`, {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            post("/products", {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">
                        {isEditMode ? "Edit Produk Mochi" : "Tambah Produk Mochi Baru"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nama Produk */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                            Nama Produk <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Contoh: Ichigo Daifuku (Strawberry)"
                            required
                            className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#273454] focus:ring-1 focus:ring-[#273454] outline-none text-slate-800 transition-colors"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Kategori & Harga Jual */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                                Kategori <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) =>
                                    setData("category_id", Number(e.target.value))
                                }
                                required
                                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#273454] focus:ring-1 focus:ring-[#273454] outline-none text-slate-800 transition-colors"
                            >
                                <option value="" disabled>
                                    Pilih Kategori
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="mt-1 text-xs text-rose-500">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                                Harga Jual (Rp) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="500"
                                value={data.price}
                                onChange={(e) => setData("price", e.target.value)}
                                placeholder="Contoh: 18000"
                                required
                                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#273454] focus:ring-1 focus:ring-[#273454] outline-none text-slate-800 transition-colors"
                            />
                            {errors.price && (
                                <p className="mt-1 text-xs text-rose-500">
                                    {errors.price}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stok (pcs) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                            Jumlah Stok (pcs) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) => setData("stock", e.target.value)}
                                placeholder="Contoh: 20"
                                required
                                className="w-full px-3.5 py-2 pr-12 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#273454] focus:ring-1 focus:ring-[#273454] outline-none text-slate-800 transition-colors"
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                pcs
                            </span>
                        </div>
                        {errors.stock && (
                            <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>
                        )}
                    </div>

                    {/* Foto Produk */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                            Foto Produk (Mochi)
                        </label>
                        <div className="flex items-center gap-4">
                            {/* Preview */}
                            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl text-slate-400">🍡</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                                />
                                <p className="mt-1 text-[11px] text-slate-400">
                                    {isEditMode
                                        ? "Pilih foto baru jika ingin mengganti. Biarkan kosong jika tidak ingin mengubah foto."
                                        : "Format: JPG, PNG, WEBP (Maks. 5MB)"}
                                </p>
                            </div>
                        </div>
                        {errors.image && (
                            <p className="mt-1 text-xs text-rose-500">{errors.image}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#273454] hover:bg-[#1f2942] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        >
                            {processing
                                ? "Menyimpan..."
                                : isEditMode
                                ? "Simpan Perubahan"
                                : "Tambah Produk"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
