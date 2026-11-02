import React, { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/main-layout";
import { Category, Product, StockStatusFilter } from "@/types";
import StockFilterBar from "./stock-management/components/stock-filter-bar";
import StockTable from "./stock-management/components/stock-table";
import ProductModal from "./stock-management/components/product-modal";
import DeleteConfirmModal from "./stock-management/components/delete-confirm-modal";

interface StockManagementProps {
    products: Product[];
    categories: Category[];
}

export default function StockManagement({
    products = [],
    categories = [],
}: StockManagementProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
    const [statusFilter, setStatusFilter] = useState<StockStatusFilter>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Modals state
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // Calculate status counts based on full products dataset
    const statusCounts = useMemo(() => {
        let safe = 0;
        let low = 0;
        let out = 0;

        products.forEach((p) => {
            if (p.stock === 0) {
                out++;
            } else if (p.stock <= 10) {
                low++;
            } else {
                safe++;
            }
        });

        return {
            all: products.length,
            safe,
            low,
            out,
        };
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Search filter
            const matchesSearch = product.name
                .toLowerCase()
                .includes(search.toLowerCase());

            // Category filter
            const matchesCategory =
                selectedCategory === "all" ||
                product.category_id === selectedCategory ||
                product.category?.id === selectedCategory;

            // Status filter
            let matchesStatus = true;
            if (statusFilter === "safe") {
                matchesStatus = product.stock > 10;
            } else if (statusFilter === "low") {
                matchesStatus = product.stock > 0 && product.stock <= 10;
            } else if (statusFilter === "out") {
                matchesStatus = product.stock === 0;
            }

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, search, selectedCategory, statusFilter]);

    // Pagination calculations
    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / itemsPerPage)
    );

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleCategoryChange = (val: number | "all") => {
        setSelectedCategory(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (val: StockStatusFilter) => {
        setStatusFilter(val);
        setCurrentPage(1);
    };

    const handleOpenAddModal = () => {
        setProductToEdit(null);
        setIsProductModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setProductToEdit(product);
        setIsProductModalOpen(true);
    };

    // Format waktu sinkronisasi
    const syncTime = useMemo(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `Hari ini ${hours}:${minutes} WIB`;
    }, []);

    return (
        <>
            <Head title="Manajemen Stok & Produk Mochi - Mochimod" />

            <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Page Header (Judul & Tombol Tambah Produk, Tanpa Deskripsi & Tanpa Export CSV) */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#273454] tracking-tight">
                            Manajemen Stok & Produk Mochi
                        </h1>

                        <button
                            type="button"
                            onClick={handleOpenAddModal}
                            className="inline-flex items-center gap-2 bg-[#273454] hover:bg-[#1e2842] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
                        >
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Tambah Produk Baru</span>
                        </button>
                    </div>

                    {/* Filter & Search Bar */}
                    <StockFilterBar
                        search={search}
                        onSearchChange={handleSearchChange}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        categories={categories}
                        statusFilter={statusFilter}
                        onStatusFilterChange={handleStatusFilterChange}
                        statusCounts={statusCounts}
                    />

                    {/* Data Table */}
                    <StockTable
                        products={paginatedProducts}
                        onEdit={handleOpenEditModal}
                        onDelete={(product) => setProductToDelete(product)}
                    />

                    {/* Table Footer: Summary & Pagination */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Summary */}
                        <div className="text-xs sm:text-sm text-slate-500 font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-semibold text-slate-800">
                                Total {products.length} Produk Terdaftar
                            </span>
                            <span>•</span>
                            <span className="text-rose-600 font-medium">
                                {statusCounts.out} Habis
                            </span>
                            <span>•</span>
                            <span className="text-amber-600 font-medium">
                                {statusCounts.low} Menipis
                            </span>
                            <span>•</span>
                            <span className="text-slate-400">
                                Terakhir sinkronisasi: {syncTime}
                            </span>
                        </div>

                        {/* Pagination Navigation */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-medium">
                                Halaman {currentPage} dari {totalPages}
                            </span>

                            <div className="flex items-center gap-1.5">
                                {/* Previous Page */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                                >
                                    ‹
                                </button>

                                {/* Page numbers */}
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`w-8 h-8 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                                            currentPage === pageNumber
                                                ? "bg-[#273454] text-white"
                                                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                {/* Next Page */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah / Edit Produk */}
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                categories={categories}
                productToEdit={productToEdit}
            />

            {/* Modal Konfirmasi Hapus Produk */}
            <DeleteConfirmModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                product={productToDelete}
            />
        </>
    );
}

StockManagement.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);