import { Head, Form } from "@inertiajs/react";
import React, { useState } from "react";
import AppLayout from "@/layouts/login-layouts";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Login Page - Mochimod" />

            <div
                className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden"
                style={{
                    background:
                        "radial-gradient(circle at 50% 40%, #FCF9F7 0%, #FAF5F1 60%, #F5EEE8 100%)",
                }}
            >
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-[410px] relative z-10">
                    <div className="bg-white rounded-[26px] p-7 sm:p-9 shadow-[0_20px_45px_rgba(220,185,170,0.18),0_4px_16px_rgba(0,0,0,0.03)] border border-[#F3ECE6] transition-all duration-300">
                        <div className="flex justify-center mb-5">
                            <div className="w-[58px] h-[58px] rounded-2xl bg-gradient-to-b from-[#FFA785] to-[#FF8462] shadow-[0_8px_20px_rgba(255,132,98,0.35)] flex items-center justify-center transform transition-transform duration-200">
                                <svg
                                    className="w-7 h-7 text-white"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2.25a4.75 4.75 0 0 0-4.75 4.75v2.25H6.5A2.75 2.75 0 0 0 3.75 12v7A2.75 2.75 0 0 0 6.5 21.75h11A2.75 2.75 0 0 0 20.25 19v-7a2.75 2.75 0 0 0-2.75-2.75h-.75V7A4.75 4.75 0 0 0 12 2.25Zm2.75 7V7a2.75 2.75 0 0 0-5.5 0v2.25h5.5ZM12 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-center text-[22px] font-bold text-[#273454] tracking-tight mb-6">
                            Login
                        </h1>

                        <Form
                            action="/login"
                            method="post"
                            className="space-y-4"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-[#576885] mb-1.5">
                                            Username
                                        </label>

                                        <div
                                            className={`relative flex items-center rounded-xl border ${
                                                errors.username
                                                    ? "border-rose-400 bg-rose-50/20"
                                                    : "border-gray-200 bg-[#F8FAFC]"
                                            } hover:border-slate-300 focus-within:border-[#374272]`}
                                        >
                                            <div className="absolute left-3.5 text-slate-400 group-focus-within:text-[#374272] pointer-events-none transition-colors duration-200">
                                                <svg
                                                    className="w-[18px] h-[18px]"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <g id="User / User_01">
                                                        <path
                                                            id="Vector"
                                                            d="M19 21C19 17.134 15.866 14 12 14C8.13401 14 5 17.134 5 21M12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7C16 9.20914 14.2091 11 12 11Z"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </g>
                                                </svg>
                                            </div>

                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                placeholder="Masukkan username"
                                                className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-colors"
                                            />
                                        </div>
                                        {errors.username && (
                                            <p className="text-[13px] text-(--warning)">
                                                {errors.username}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-[13px] font-semibold text-[#576885]">
                                                Password
                                            </label>
                                        </div>

                                        <div className={`relative flex items-center rounded-xl bg-[#F8FAFC] border ${errors.password ? "border-(--warning)" : "border-gray-200"} bg-rose-50/20 hover:border-slate-300 focus-within:!border-[#374272] focus-within:!bg-white focus-within:ring-4 focus-within:ring-[#374272]/10 transition-all duration-200 group`}>
                                            <div className="absolute left-3.5 text-slate-400 group-focus-within:text-[#374272] pointer-events-none transition-colors duration-200">
                                                <svg
                                                    className="w-[18px] h-[18px]"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect
                                                        width="18"
                                                        height="11"
                                                        x="3"
                                                        y="11"
                                                        rx="2"
                                                        ry="2"
                                                    />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </div>

                                            <div
                                                x-data="{ showPassword: false }"
                                                className="flex items-center"
                                            >
                                                <input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="password"
                                                    id="password"
                                                    placeholder="Masukkan password"
                                                    className="w-full bg-transparent py-3 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-colors"
                                                />

                                                <button
                                                    type="button"
                                                    className="absolute right-2.5 p-1.5 text-slate-400 hover:text-[#374272] hover:bg-slate-200/50 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <svg
                                                            className="w-[18px] h-[18px] text-[#374272]"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                                                            <circle
                                                                cx="12"
                                                                cy="12"
                                                                r="3"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            className="w-[18px] h-[18px]"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                                                            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                                                            <path d="M17.479 17.499A10.75 10.75 0 0 1 2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.417-5.38" />
                                                            <line
                                                                x1="2"
                                                                x2="22"
                                                                y1="2"
                                                                y2="22"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        {errors.password && (
                                            <p className="text-[13px] text-(--warning)">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3.5 px-4 rounded-xl bg-[#374272] hover:bg-[#2C365E] active:scale-[0.99] text-white text-sm font-semibold shadow-md shadow-[#374272]/20 hover:shadow-lg hover:shadow-[#374272]/30 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-wait group"
                                        >
                                            {processing ? (
                                                <span className="flex flex-row flex-nowrap items-center justify-center gap-2">
                                                    <svg
                                                        className="animate-spin h-4 w-4 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    <span>
                                                        Memverifikasi...
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <span>Masuk ke Sistem</span>
                                                    <svg
                                                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                        />
                                                    </svg>
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}

LoginPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
