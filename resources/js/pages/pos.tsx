import { Head } from "@inertiajs/react";
import React from "react";
import AppLayout from "@/layouts/main-layout";
import { useCart } from "./use-cart";
import CartPanel from "./cart-panel";

export default function Pos() {
    const { items, subTotal, addItem, removeItem, setQuantity, clear } =
        useCart();

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
                                        name="username"
                                        id="username"
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
                            <div className="flex flex-row gap-[8px] items-center">
                                <div className="bg-accent font-bold text-small text-white px-[16px] py-[6px] rounded-[50px]">
                                    <p className="">Semua Kategori</p>
                                </div>
                                <div className="bg-white font-bold text-small px-[16px] py-[6px] rounded-[50px] border border-gray-200 hover:border-accent hover:translate-y-[-2px] duration-300 ease-in-out cursor-pointer">
                                    <p>Mochi</p>
                                </div>
                                <div className="bg-white font-bold text-small px-[16px] py-[6px] rounded-[50px] border border-gray-200 hover:border-accent hover:translate-y-[-2px] duration-300 ease-in-out cursor-pointer">
                                    <p>Jus</p>
                                </div>
                                {/* Filter opsi kategori */}
                            </div>
                            <div className="w-full overflow-x-auto no-scrollbar">
                                <div className="grid grid-flow-row grid-cols-6 auto-rows-auto gap-4 p-[2px]">
                                    {/* Dummy Katalog Produk 1 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Daifuku Stroberi Coklat
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 8.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 1 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Daifuku Anggur Coklat
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 8.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 2 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Mochi Milo
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 8.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 3 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Mochi Choco Crunchy
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 8.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 4 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Mochi Tiramisu
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 8.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 5 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Mochi Red Velvet
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 8.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 6 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Mochi Dubai Pistachio
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 20.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 7 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Mochi Dubai Pistachio Coklat
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 22.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 8 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Mochi Marshmallow
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 8.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 9 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Mochi Matcha
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 8.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Dummy Katalog Produk 10 */}
                                    <div className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">
                                                        Stok: 24 pcs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-[75px]">
                                                <p className="font-bold text-normal">
                                                    Daifuku Mango Cream
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                                            <div className="flex flex-row gap-[14px] justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-small">
                                                        Harga
                                                    </p>
                                                    <p className="text-normal font-bold text-nowrap">
                                                        Rp 8.000
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Ini buat list produk */}
                                </div>
                            </div>
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
