import { usePage } from '@inertiajs/react';
import UserPopover from '@/components/user-popover';

const navigationItems = [
    { href: '/', label: 'POS / Kasir' },
    { href: '/manajemen-stok', label: 'Kelola Produk & Stok' },
    { href: '/laporan-penjualan', label: 'Laporan Penjualan' },
];

export default function TopBar() {
    const { url } = usePage();

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white">
            <div className="mx-auto flex min-h-16 w-full max-w-[1600px] flex-wrap items-center gap-3 px-3 py-2 sm:px-5 lg:flex-nowrap lg:px-6 lg:py-0">
                <a
                    href="/"
                    className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-none"
                >
                    <img
                        src="/mochimod-logo.png"
                        alt="Logo Mochimod"
                        className="h-10 w-10 shrink-0 rounded-full object-contain sm:h-12 sm:w-12"
                    />
                    <span className="truncate text-lg font-bold tracking-tight text-[#273454] sm:text-xl">
                        MOCHI<span className="text-orange-500">MOD</span>
                    </span>
                </a>

                <nav className="order-3 flex w-full min-w-0 items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar lg:order-none lg:w-auto lg:flex-1 lg:justify-center">
                    {navigationItems.map((item) => {
                        const active =
                            item.href === '/manajemen-stok'
                                ? url.startsWith('/products') ||
                                  url === item.href
                                : url === item.href;

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                                    active
                                        ? 'bg-accent text-white'
                                        : 'text-[#273454] hover:bg-[#EEEEEE]'
                                }`}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>

                <div className="shrink-0">
                    <UserPopover />
                </div>
            </div>
        </header>
    );
}
