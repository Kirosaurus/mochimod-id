import { usePage } from '@inertiajs/react';
import UserPopover from '@/components/user-popover';

const navigationItems = [
    { href: '/', label: 'POS / Kasir' },
    { href: '/manajemen-stok', label: 'Kelola Stok' },
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
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#FFA785] to-[#FF8462] text-white shadow-sm shadow-orange-500/20 sm:h-10 sm:w-10">
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2.25a4.75 4.75 0 0 0-4.75 4.75v2.25H6.5A2.75 2.75 0 0 0 3.75 12v7A2.75 2.75 0 0 0 6.5 21.75h11A2.75 2.75 0 0 0 20.25 19v-7a2.75 2.75 0 0 0-2.75-2.75h-.75V7A4.75 4.75 0 0 0 12 2.25Zm2.75 7V7a4.75 4.75 0 0 0-9.5 0v2.25h9.5ZM12 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
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
