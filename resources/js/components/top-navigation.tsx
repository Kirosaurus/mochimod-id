import {usePage} from "@inertiajs/react";
import UserPopover from "@/components/user-popover";


export default function TopBar() {
    const { url, component } = usePage();

    return (
        <>
            {console.log(usePage().url)}
            <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
                <div className="mx-auto px-[20px] h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FFA785] to-[#FF8462] flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M12 2.25a4.75 4.75 0 0 0-4.75 4.75v2.25H6.5A2.75 2.75 0 0 0 3.75 12v7A2.75 2.75 0 0 0 6.5 21.75h11A2.75 2.75 0 0 0 20.25 19v-7a2.75 2.75 0 0 0-2.75-2.75h-.75V7A4.75 4.75 0 0 0 12 2.25Zm2.75 7V7a2.75 2.75 0 0 0-5.5 0v2.25h5.5ZM12 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="flex d-flex-col items-center gap-[20px]">
                            <span className="font-bold text-lg text-[#273454] tracking-tight text-[20px]">
                                MOCHI
                                <span className="text-orange-500">MOD</span>
                            </span>
                            <div className="flex d-flex-col gap-[6px]">
                                <div>
                                    <a
                                        href="/"
                                        className="font-semibold hover:scale-"
                                    >
                                        <button className={`${usePage().url === '/' ? 'bg-accent text-white' : 'bg-white hover:bg-[#EEEEEE]'} cursor-pointer duration-300 ease-in-out px-[16px] py-[8px] rounded-[8px]`}>
                                            POS / Kasir
                                        </button>
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href="/manajemen-stok"
                                        className="font-semibold hover:scale-"
                                    >
                                        <button className={`${usePage().url === '/manajemen-stok' ? 'bg-accent text-white' : 'bg-white hover:bg-[#EEEEEE]'} cursor-pointer duration-300 ease-in-out px-[16px] py-[8px] rounded-[8px]`}>
                                            Kelola Stok
                                        </button>
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href="/laporan-penjualan"
                                        className="font-semibold hover:scale-"
                                    >
                                        <button className={`${usePage().url === '/laporan-penjualan' ? 'bg-accent text-white' : 'bg-white hover:bg-[#EEEEEE]'} cursor-pointer duration-300 ease-in-out px-[16px] py-[8px] rounded-[8px]`}>
                                            Laporan Penjualan
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2.5">
                            <UserPopover />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
