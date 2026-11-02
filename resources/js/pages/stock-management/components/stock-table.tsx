import React from "react";
import { Product } from "@/types";

interface StockTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export default function StockTable({
    products,
    onEdit,
    onDelete,
}: StockTableProps) {
    const formatRupiah = (amount: string | number) => {
        const num = typeof amount === "string" ? parseFloat(amount) : amount;
        return `Rp ${Math.floor(num).toLocaleString("id-ID")}`;
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) {
            return {
                label: "Habis",
                className: "bg-rose-50 text-rose-700 border-rose-200",
                stockColor: "text-rose-600",
            };
        }
        if (stock <= 10) {
            return {
                label: "Menipis",
                className: "bg-amber-50 text-amber-700 border-amber-200",
                stockColor: "text-amber-600",
            };
        }
        return {
            label: "Aman",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            stockColor: "text-slate-800",
        };
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-6 text-center w-20">ITEM</th>
                            <th className="py-4 px-6">NAMA PRODUK</th>
                            <th className="py-4 px-6 text-center">KATEGORI</th>
                            <th className="py-4 px-6">HARGA JUAL</th>
                            <th className="py-4 px-6 text-center">STOK</th>
                            <th className="py-4 px-6 text-center">STATUS</th>
                            <th className="py-4 px-6 text-center">AKSI CEPAT UPDATE</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-12 text-center text-slate-400"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <svg
                                            className="w-10 h-10 text-slate-300"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="8" y1="12" x2="16" y2="12" />
                                        </svg>
                                        <p className="font-medium text-slate-500">
                                            Tidak ada produk yang sesuai kriteria pencarian
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const status = getStockStatus(product.stock);

                                return (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-slate-50/80 transition-colors group"
                                    >
                                        {/* ITEM (Foto Produk dari DB / Fallback) */}
                                        <td className="py-3 px-6 text-center">
                                            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 border border-slate-200/60 overflow-hidden flex items-center justify-center p-1">
                                                {product.image ? (
                                                    <img
                                                        src={
                                                            product.image.startsWith("http")
                                                                ? product.image
                                                                : `/storage/${product.image}`
                                                        }
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            // Fallback to placeholder if image load fails
                                                            e.currentTarget.style.display = "none";
                                                            e.currentTarget.parentElement?.classList.add(
                                                                "bg-orange-50",
                                                                "text-orange-500"
                                                            );
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full rounded-lg bg-orange-100/70 text-orange-500 flex items-center justify-center font-bold text-lg">
                                                        🍡
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* NAMA PRODUK */}
                                        <td className="py-3 px-6 font-semibold text-slate-800">
                                            {product.name}
                                        </td>

                                        {/* KATEGORI (Badge seragam & menyatu dengan kolom) */}
                                        <td className="py-3 px-6 text-center">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/70">
                                                {product.category?.name || "Umum"}
                                            </span>
                                        </td>

                                        {/* HARGA JUAL */}
                                        <td className="py-3 px-6 font-medium text-slate-700">
                                            {formatRupiah(product.price)}
                                        </td>

                                        {/* STOK (satuan pcs) */}
                                        <td className="py-3 px-6 text-center">
                                            <span
                                                className={`text-base font-bold ${status.stockColor}`}
                                            >
                                                {product.stock}
                                            </span>{" "}
                                            <span className="text-xs text-slate-400 font-normal">
                                                pcs
                                            </span>
                                        </td>

                                        {/* STATUS (Hanya kata tanpa icon) */}
                                        <td className="py-3 px-6 text-center">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${status.className}`}
                                            >
                                                {status.label}
                                            </span>
                                        </td>

                                        {/* AKSI CEPAT UPDATE */}
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Edit Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(product)}
                                                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                                    title="Edit Produk"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M12 20h9" />
                                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                    </svg>
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(product)}
                                                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                                    title="Hapus Produk"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
