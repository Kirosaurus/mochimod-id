import React from "react";
import { Category, StockStatusFilter } from "@/types";

interface StockFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    selectedCategory: number | "all";
    onCategoryChange: (value: number | "all") => void;
    categories: Category[];
    statusFilter: StockStatusFilter;
    onStatusFilterChange: (status: StockStatusFilter) => void;
    statusCounts: {
        all: number;
        safe: number;
        low: number;
        out: number;
    };
}

export default function StockFilterBar({
    search,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
    statusFilter,
    onStatusFilterChange,
    statusCounts,
}: StockFilterBarProps) {
    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input & Category Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
                {/* Search Bar */}
                <div className="w-full sm:w-80 md:w-96 relative flex items-center rounded-xl border border-slate-200 bg-[#F8FAFC] focus-within:border-[#273454] focus-within:bg-white transition-all duration-200">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Cari berdasarkan Nama Mochi..."
                        className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none focus:ring-0"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="mr-3 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Category Dropdown */}
                <div className="w-full sm:w-auto relative min-w-[200px]">
                    <select
                        value={selectedCategory}
                        onChange={(e) =>
                            onCategoryChange(
                                e.target.value === "all"
                                    ? "all"
                                    : Number(e.target.value)
                            )
                        }
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2 pr-9 hover:border-slate-300 focus:outline-none focus:border-[#273454] cursor-pointer transition-colors"
                    >
                        <option value="all">Semua Kategori (Semua)</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Status Filter Tabs (NO DOT INDICATOR per user feedback) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {/* Semua Status */}
                <button
                    type="button"
                    onClick={() => onStatusFilterChange("all")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap ${
                        statusFilter === "all"
                            ? "bg-[#273454] text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                    Semua Status ({statusCounts.all})
                </button>

                {/* Stok Aman */}
                <button
                    type="button"
                    onClick={() => onStatusFilterChange("safe")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap ${
                        statusFilter === "safe"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100"
                    }`}
                >
                    Stok Aman ({statusCounts.safe})
                </button>

                {/* Stok Menipis */}
                <button
                    type="button"
                    onClick={() => onStatusFilterChange("low")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap ${
                        statusFilter === "low"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100"
                    }`}
                >
                    Stok Menipis ({statusCounts.low})
                </button>

                {/* Habis */}
                <button
                    type="button"
                    onClick={() => onStatusFilterChange("out")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap ${
                        statusFilter === "out"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100"
                    }`}
                >
                    Habis ({statusCounts.out})
                </button>
            </div>
        </div>
    );
}
