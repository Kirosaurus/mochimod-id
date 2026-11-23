import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import AppLayout from "@/layouts/main-layout";
import { useCart } from "./use-cart";
import CartPanel from "./cart-panel";
import ProductGrid from "./product-grid";
import { CartItem, Category, Product } from "@/types";
import Checkout from "./checkout";

interface props {
    products: Product[];
    categories: Category[];
}
export default function Pos({ products, categories }: props) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState<number | null>(null);

    const [isCheckoutOpen, setIsCheckoutOpen] =
        useState(false);

    const { items, subTotal, addItem, removeItem, setQuantity, clear } =
        useCart();

    const filtered = products.filter((p) => {
        const matchesSearch = p.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory = selectedCategory === null || p.category.id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Head title="POS Order - Mochimod" />

            <main>
                <div className="min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] lg:overflow-hidden w-full p-3 sm:p-4">
                    <div className="flex min-h-[calc(100vh-88px)] lg:h-full lg:min-h-0 flex-col gap-4 lg:flex-row">
                        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:h-full lg:min-h-0">
                            <div className="flex w-full shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white p-2">
                                <div
                                    className={`w-full relative flex items-center rounded-xl border border-transparent hover:border-slate-300 focus-within:border-[#374272] bg-[#F8FAFC] duration-300 ease-in-out`}
                                >
                                    <div className="absolute left-3.5 text-slate-400 group-focus-within:text-[#374272] pointer-events-none transition-colors">
                                        <svg
                                            width="16px"
                                            height="16px"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <g id="Interface / Search_Magnifying_Glass">
                                                <path
                                                    id="Vector"
                                                    d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z"
                                                    stroke="#000000"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </g>
                                        </svg>
                                    </div>

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Cari produk..."
                                        className="w-full min-w-0 bg-transparent py-2 pl-11 pr-3 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-colors duration-300 ease-in-out"
                                    />
                                </div>
                                
                                {/* Search bar dan toolbar lainnya */}
                            </div>
                            <div className="no-scrollbar flex shrink-0 items-center gap-2 overflow-x-auto pb-1 pt-1">
                                {/* Tombol "Semua Kategori" */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(null)}
                                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                                        selectedCategory === null
                                            ? "bg-accent text-white shadow-sm"
                                            : "bg-white text-slate-700 border border-gray-200 hover:border-accent hover:-translate-y-0.5 hover:cursor-pointer "
                                    }`}
                                >
                                    Semua Kategori
                                </button>
                                {/* Looping kategori dari database */}
                                {
                                categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory(cat.id)
                                        }
                                        className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                                            selectedCategory === cat.id
                                                ? "bg-accent text-white shadow-sm"
                                                : "bg-white text-slate-700 border border-gray-200 hover:border-accent hover:-translate-y-0.5 hover:cursor-pointer "
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))
                                }
                            </div>
                            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                                <ProductGrid products={filtered} onAdd={addItem} />
                            </div>
                        </div>
                        <div className="flex min-h-[420px] w-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-3 sm:min-h-[460px] lg:h-full lg:min-h-0 lg:w-[360px] lg:shrink-0 lg:p-4 xl:w-[395px]">
                            <CartPanel
                                items={items}
                                subtotal={subTotal}
                                onRemove={removeItem}
                                onSetQuantity={setQuantity}
                                onCheckout={() => setIsCheckoutOpen(true)}
                                onClear={clear}
                            />
                        </div>
                    </div>
                </div>
            </main>
            {isCheckoutOpen && (
    <Checkout
        items={items}
        subtotal={subTotal}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => {
            clear();
            setIsCheckoutOpen(false);
        }}
    />
)}
        </>
    );
}

Pos.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
