import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Product } from "@/types";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    product,
}: DeleteConfirmModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !product) return null;

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/products/${product.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-200 overflow-hidden flex flex-col p-6">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                </div>

                <h3 className="text-lg font-bold text-slate-800 text-center">
                    Hapus Produk?
                </h3>
                <p className="mt-2 text-sm text-slate-500 text-center">
                    Apakah Anda yakin ingin menghapus produk{" "}
                    <span className="font-semibold text-slate-800">
                        "{product.name}"
                    </span>
                    ? Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}
