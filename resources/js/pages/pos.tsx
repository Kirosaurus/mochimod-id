import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import AppLayout from "@/layouts/main-layout";
import { useCart } from "./use-cart";
import CartPanel from "./cart-panel";
import ProductGrid from "./product-grid";
import { CartItem, Category, Product } from "@/types";

interface props {
    products: Product[];
    categories: Category[];
}
export default function Pos({ products, categories }: props) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null,
    );
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
                <div className="w-full h-[90vh] p-[16px]">
                    <div className="h-full flex d-flex-row gap-[16px]">
                        <div className="flex flex-col w-full corner-[16px] gap-[12px] ">
                            <div className="w-full h-auto p-[8px] bg-white rounded-[12px] border border-gray-200 flex flex-row items-center gap-[10px]">
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
                                        placeholder="Cari Produk... (Nama Produk atau Kode Produk)"
                                        className="w-full bg-transparent py-[8px] pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-colors duration-300 ease-in-out"
                                    />
                                </div>
                                <div className="w-9 h-9 rounded-[8px] bg-[#F8FAFC] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-110 duration-300 ease-in-out cursor-pointer">
                                    <svg
                                        width="16px"
                                        height="16px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M19 3H5C3.89543 3 3 3.89543 3 5V6.17157C3 6.70201 3.21071 7.21071 3.58579 7.58579L9.41421 13.4142C9.78929 13.7893 10 14.298 10 14.8284V20V20.2857C10 20.9183 10.7649 21.2351 11.2122 20.7878L12 20L13.4142 18.5858C13.7893 18.2107 14 17.702 14 17.1716V14.8284C14 14.298 14.2107 13.7893 14.5858 13.4142L20.4142 7.58579C20.7893 7.21071 21 6.70201 21 6.17157V5C21 3.89543 20.1046 3 19 3Z"
                                            stroke="#323232"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                                {/* Search bar dan toolbar lainnya */}
                            </div>
                            <div className="flex flex-row gap-[8px] items-center overflow-x-auto pb-1">
                                {/* Tombol "Semua Kategori" */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(null)}
                                    className={`font-bold text-sm px-[16px] py-[6px] rounded-[50px] transition-all duration-200 cursor-pointer ${
                                        selectedCategory === null
                                            ? "bg-accent text-white shadow-sm"
                                            : "bg-white text-slate-700 border border-gray-200 hover:border-accent hover:-translate-y-0.5"
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
                                        className={`font-bold text-sm px-[16px] py-[6px] rounded-[50px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                                            selectedCategory === cat.id
                                                ? "bg-accent text-white shadow-sm"
                                                : "bg-white text-slate-700 border border-gray-200 hover:border-accent hover:-translate-y-0.5"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))
                                }
                            </div>
                            <ProductGrid products={filtered} onAdd={addItem} />
                        </div>
                        <div className="w-[395px] h-full p-[16px] bg-white corner-[16px] rounded-[16px] box-border border border-gray-200">
                            <CartPanel
                                items={items}
                                subtotal={subTotal}
                                onRemove={removeItem}
                                onSetQuantity={setQuantity}
                                onClear={clear}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

Pos.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
