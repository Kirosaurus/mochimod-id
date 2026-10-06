import { Head } from "@inertiajs/react";
import React from "react";
import AppLayout from "@/layouts/main-layout";

export default function StockManagement() {
    return (
        <>
            <Head title="Manajemen Stok - Mochimod" />
            <div className="flex-1 flex flex-col w-full min-h-0 p-[16px] gap-[24px]">
                <div className="flex flex-row justify-between items-center px-[16px]">
                    <div className="flex flex-col">
                        <p className="font-extrabold text-headline-2 text-accent">
                            Manajemen Stok & Produk Mochi
                        </p>
                        <p className="text-normal text-gray-600">
                            Monitoring kuantitas bahan & produk siap jual di
                            Outlet Tebet
                        </p>
                    </div>
                    <div className="flex flex-row gap-[12px]">
                        <div className="flex flex-row bg-white rounded-[12px] px-[16px] py-[10px] border border-gray-400 text-semibold text-normal gap-[8px] hover:scale-105 hover:border-gray-800 duration-300 ease-in-out cursor-pointer">
                            <svg
                                width="24px"
                                height="24px"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <g id="Interface / Download">
                                    <path
                                        id="Vector"
                                        d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                                        stroke="#000000"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </g>
                            </svg>
                            <p>Export CSV / Laporan Stok</p>
                        </div>
                        <div className="flex flex-row bg-accent text-white rounded-[12px] px-[16px] py-[10px] border border-gray-400 text-semibold text-normal gap-[8px] hover:scale-105 hover:shadow-[0px_0px_30px_-10px_var(--color-accent)] duration-300 ease-in-out cursor-pointer">
                            <svg
                                width="24px"
                                height="24px"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7C13 6.44771 12.5523 6 12 6C11.4477 6 11 6.44771 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17Z"
                                    fill="white"
                                />
                            </svg>
                            <p>Tambah Produk Baru</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full h-auto p-[12px] bg-white rounded-[12px] border border-gray-200 flex flex-row items-center gap-[10px]">
                    <div
                        className={`w-full relative flex flex-1 items-center rounded-xl border border-transparent hover:border-slate-300 focus-within:border-[#374272] bg-[#F8FAFC] duration-300 ease-in-out`}
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
                    <div className="flex flex-row gap-[10px] items-center">
                        <div>
                            <p>
                                Semua Kategori
                            </p>
                        </div>
                        <div className="w-[1px] h-[20px] border border-gray-400">

                        </div>
                        <div className="h-full flex flex-row gap-[6px]">
                            <div className={`flex items-center px-[12px] bg-accent py-[6px] rounded-[8px] text-white font-semibold text-normal`}>
                                <p className="text-nowrap ">Semua Status</p>
                            </div>
                            <div className={`flex items-center bg-success-bg px-[12px] py-[6px] rounded-[8px] text-success font-semibold text-normal border border-success-outline hover:scale-105 hover:border-success duration-300 ease-in-out cursor-pointer`}>
                                <p className="text-nowrap ">Stok Aman</p>
                            </div>
                            <div className="flex items-center bg-warning-bg px-[12px] py-[6px] rounded-[8px] text-warning font-semibold text-normal border border-warning-outline hover:scale-105 hover:border-warning duration-300 ease-in-out cursor-pointer">
                                <p className="text-nowrap">Stok Menipis</p>
                            </div>
                            <div className="flex items-center bg-failed-bg px-[12px] py-[6px] rounded-[8px] text-failed font-semibold text-normal border border-failed-outline hover:scale-105 hover:border-failed duration-300 ease-in-out cursor-pointer">
                                <p className="text-nowrap">Stok Habis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

StockManagement.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);
