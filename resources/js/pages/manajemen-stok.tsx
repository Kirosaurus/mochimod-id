import { Head } from "@inertiajs/react";
import React from "react";
import AppLayout from "@/layouts/main-layout";

export default function Test() {
    return (
        <>
            <Head title="Manajemen Stok - Mochimod" />

            <main>
                <div className="w-full h-screen p-[16px]">
                    <div className="h-full flex d-flex-row gap-[16px]">
                        <div className="flex flex-col w-full corner-[16px] gap-[12px] ">
                            <div className="w-full h-auto p-[8px] bg-white rounded-[12px] border border-gray-200 flex flex-row">
                                <div
                                    className={`w-full relative flex items-center rounded-xl border border-transparent hover:border-slate-300 focus-within:border-[#374272] bg-[#F8FAFC]`}
                                >
                                    <div className="absolute left-3.5 text-slate-400 group-focus-within:text-[#374272] pointer-events-none transition-colors duration-200">
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
                                        className="w-full bg-transparent py-[8px] pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="w-[32px] h-[32px] bg-accent rounded-[8px]"></div>
                                {/* Search bar dan toolbar lainnya */}
                            </div>
                            <div>
                                Ini nanti isinya ada list filter buat kategori
                                {/* Filter opsi kategori */}
                            </div>
                            <div className="w-full overflow-x-auto">
                                <div className="grid grid-flow-row grid-cols-6 auto-rows-[300px] gap-4 p-[8px]">
                                    <div className="w-full h-full bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)]">
                                        <div className="flex flex-col gap-[4px]">
                                            <div className="w-full h-[128px] bg-black rounded-[8px]"></div>
                                            <div className="flex flex-row w-fill items-center justify-between">
                                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                                    <p className="text-success font-bold text-small">Stok: 24 pcs</p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-small text-gray-600">
                                                        #DF-01
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-full bg-white rounded-[12px] p-[12px]"></div>
                                    <div className="w-full h-full bg-white rounded-[12px] p-[12px]"></div>
                                    <div className="w-full h-full bg-white rounded-[12px] p-[12px]"></div>
                                    <div className="w-full h-full bg-white rounded-[12px] p-[12px]"></div>
                                    {/* Ini buat list produk */}
                                </div>
                            </div>
                        </div>
                        <div className="w-[395px] h-full p-[16px] bg-white corner-[16px] rounded-[16px] box-border border border-gray-200">
                            <div className="">
                                <p className="text-accent font-bold">
                                    Pesanan Aktif
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

Test.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
