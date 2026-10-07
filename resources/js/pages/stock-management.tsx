import { Head } from "@inertiajs/react";
import React from "react";
import AppLayout from "@/layouts/main-layout";
import { Product } from "@/types";

interface props {
    products: Product[];
}

export default function StockManagement({ products }: props) {
    function setStatus(stock: number) {
        if (stock === 0) {
            return (
                <div className="flex items-center justify-center bg-failed-bg px-[12px] py-[6px] rounded-[8px] text-failed font-semibold text-normal border border-failed-outline hover:scale-105 hover:border-failed duration-300 ease-in-out cursor-pointer">
                    <p className="text-nowrap">Stok Habis</p>
                </div>
            );
        }

        if (stock < 10) {
            return (
                <div className="flex items-center justify-center bg-warning-bg px-[12px] py-[6px] rounded-[8px] text-warning font-semibold text-normal border border-warning-outline hover:scale-105 hover:border-warning duration-300 ease-in-out cursor-pointer">
                    <p className="text-nowrap">Stok Menipis</p>
                </div>
            );
        }

        return (
            <div
                className={`flex items-center justify-center bg-success-bg px-[12px] py-[6px] rounded-[8px] text-success font-semibold text-normal border border-success-outline`}
            >
                <p className="text-nowrap ">Stok Aman</p>
            </div>
        );
    }

    function setStockStatus(stock: number){
        if(stock === 0){
            return <span className="font-extrabold text-normal text-failed">{stock} </span>
        }

        if(stock < 10){
            return <span className="font-extrabold text-normal text-warning">{stock} </span>
        }

        return(<span className="font-extrabold text-normal text-success">{stock} </span>)
    }

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
                            placeholder="Cari Nama Produk..."
                            className="w-full bg-transparent py-[8px] pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-colors duration-300 ease-in-out"
                        />
                    </div>
                    <div className="flex flex-row gap-[10px] items-center">
                        <div>
                            <p>Semua Kategori</p>
                        </div>
                        <div className="w-[1px] h-[20px] border border-gray-400"></div>
                        <div className="h-full flex flex-row gap-[6px]">
                            <div
                                className={`flex items-center px-[12px] bg-accent py-[6px] rounded-[8px] text-white font-semibold text-normal`}
                            >
                                <p className="text-nowrap ">Semua Status</p>
                            </div>
                            <div
                                className={`flex items-center bg-success-bg px-[12px] py-[6px] rounded-[8px] text-success font-semibold text-normal border border-success-outline hover:scale-105 hover:border-success duration-300 ease-in-out cursor-pointer`}
                            >
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
                <div className="w-full rounded-[16px] overflow-hidden border border-gray-400">
                    <table className="w-full bg-white rounded-full text-center table-fixed">
                        <thead>
                            <tr className="bg-[#F8FAFC] text-gray-600">
                                <th className="py-[24px]">Kode</th>
                                <th className="text-left">Nama Produk</th>
                                <th>Kategori</th>
                                <th>Harga</th>
                                <th>Stok</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr className="bg-white">
                                    <td className="py-[24px]">{item.id}</td>
                                    <td className="py-[24px] text-left text-normal font-bold">
                                        {item.name}
                                    </td>
                                    <td className="py-[24px] flex flex-row justify-center">
                                        {item.category_id === 1 ? (
                                            <div className="bg-gray-200 rounded-full w-auto py-[4px] px-[16px]">
                                                <p className="text-accent">
                                                    Mochi
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-primary/10 rounded-full w-auto py-[4px] px-[16px]">
                                                <p className="text-primary">
                                                    Jus
                                                </p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-[24px]">
                                        Rp {item.price}
                                    </td>
                                    <td className="py-[24px] text-small">
                                        {setStockStatus(item.stock)}
                                        pcs
                                    </td>
                                    <td className="py-[24px] flex justify-center">
                                        {setStatus(item.stock)}
                                    </td>
                                    <td className="py-[24px]">
                                        <div className="flex w-full justify-center">
                                            <button className="flex flex-row gap-[8px] hover:scale-110 duration-300 ease-in-out cursor-pointer hover:bg-gray-200 rounded-[8px] p-2">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M17 3.00006C17.2626 2.73741 17.5744 2.52907 17.9176 2.38693C18.2608 2.24479 18.6286 2.17163 19 2.17163C19.3714 2.17163 19.7392 2.24479 20.0824 2.38693C20.4256 2.52907 20.7374 2.73741 21 3.00006C21.2626 3.2627 21.471 3.57451 21.6131 3.91767C21.7553 4.26083 21.8284 4.62862 21.8284 5.00006C21.8284 5.37149 21.7553 5.73929 21.6131 6.08245C21.471 6.42561 21.2626 6.73741 21 7.00006L7.5 20.5001L2 22.0001L3.5 16.5001L17 3.00006Z"
                                                        stroke="black"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                                <p>Ubah</p>
                                            </button>
                                            <button className="flex flex-row gap-[8px] hover:scale-110 duration-300 ease-in-out cursor-pointer hover:bg-failed-bg rounded-[8px] p-2">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M3 6H5H21"
                                                        stroke="var(--color-failed)"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                    <path
                                                        d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                                                        stroke="var(--color-failed)"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                    <path
                                                        d="M10 11V17"
                                                        stroke="var(--color-failed)"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                    <path
                                                        d="M14 11V17"
                                                        stroke="var(--color-failed)"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                                <p className="text-failed">Hapus</p>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

StockManagement.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);
