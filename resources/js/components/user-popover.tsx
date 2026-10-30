import {router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState} from 'react';
import type { Auth } from '@/types/auth';

type PageProps = {
    auth: Auth;
};

function SettingsIcon() {
    return (
        <svg

        
        aria-hidden='true'
        className='h-5 w-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='1.8'

    >  

    <path
    strokeLinecap='round'  
    strokeLinejoin='round'
    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543-.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543-.826-3.31z'

    />

    <circle cx='12' cy='11.25' r='2.25' />
    </svg>

    );
}

function LogoutIcon(){
    return (
        <svg
        aria-hidden='true'
        className="h-5 w-5"
        fill="none"
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='1.8'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M14.25 8.25V6.7  5A2.25 2.25 0 0 0 12 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v9a2.25 2.25 0 0 0 2.25 2.25H12a2.25 2.25 0 0 0 2.25-2.25v-1.5M10.5 12h9m0 0-3-3m3 3-3 3'
            />
        </svg>
    );
}

export default function UserPopover () {
    const { auth } = usePage<PageProps>().props;
    const [ open, setOpen ] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function closeWhenClickedOutside(event: MouseEvent) {

            if ( popoverRef.current && 
                !popoverRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

    function closeWithEscape(event: KeyboardEvent) {
        if (event.key === "Escape"){
            setOpen(false);

        }

    }
    
    document.addEventListener("mousedown", closeWhenClickedOutside);
    document.addEventListener("keydown", closeWithEscape);

    return () => {
        document.removeEventListener(
            "mousedown",
            closeWhenClickedOutside,
        );
        document.removeEventListener(
            "keydown",
            closeWithEscape,);
    };
    }, []);
    function handleLogout() {
        router.post('/Logout');
    }

    return (
        <div ref={popoverRef} className='relative'>
            <button
            type="button"
                aria-label="Buka menu akun"
                aria-expanded={open}
                aria-haspopup="menu"
                className="w-9 h-9 rounded-full bg-accent/10 text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-110 duration-300 ease-in-out cursor-pointer"
                onClick={() => setOpen((isOpen) => !isOpen)}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M19 21C19 17.134 15.866 14 12 14C8.13401 14 5 17.134 5 21M12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7C16 9.20914 14.2091 11 12 11Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.16)]"
                >
                    <div className="border-b border-slate-200 px-3 pb-3">
                        <p className="truncate text-[19px] font-bold leading-6 text-slate-900">
                            {auth.user.name}
                        </p>

                        <p className="truncate text-sm leading-5 text-slate-700">
                            {auth.user.email}
                        </p>
                    </div>

                    <div className="mt-3 space-y-1">
                        <button
                            type="button"
                            role="menuitem"
                            className="flex w-full items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-200"
                        >
                            <SettingsIcon />
                            <span>Pengaturan</span>
                        </button>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-sm text-rose-400 transition-colors hover:bg-rose-50"
                        >
                            <LogoutIcon />
                            <span>Keluar</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}