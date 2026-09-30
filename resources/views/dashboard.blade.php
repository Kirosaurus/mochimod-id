<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Dashboard - Mochimod-Id</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

        <style>
            body {
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            }
        </style>

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="min-h-full bg-[#FAF7F5] text-slate-800 antialiased flex flex-col">
        <!-- Top Navigation -->
        <header class="bg-white border-b border-slate-200/80 sticky top-0 z-30">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FFA785] to-[#FF8462] flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path fill-rule="evenodd" d="M12 2.25a4.75 4.75 0 0 0-4.75 4.75v2.25H6.5A2.75 2.75 0 0 0 3.75 12v7A2.75 2.75 0 0 0 6.5 21.75h11A2.75 2.75 0 0 0 20.25 19v-7a2.75 2.75 0 0 0-2.75-2.75h-.75V7A4.75 4.75 0 0 0 12 2.25Zm2.75 7V7a2.75 2.75 0 0 0-5.5 0v2.25h5.5ZM12 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <span class="font-bold text-lg text-[#273454] tracking-tight">Mochimod<span class="text-orange-500">-Id</span></span>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-full bg-[#374272] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {{ strtoupper(substr(auth()->user()->name ?? 'U', 0, 2)) }}
                        </div>
                        <div class="hidden sm:block text-left">
                            <p class="text-xs font-bold text-slate-800 leading-none">{{ auth()->user()->name }}</p>
                            <p class="text-[11px] text-slate-500 font-medium">@<span>{{ auth()->user()->username ?? 'user' }}</span></p>
                        </div>
                    </div>

                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-500 rounded-lg border border-rose-200 transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-xs">
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Keluar</span>
                        </button>
                    </form>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
            <!-- Welcome Header Card -->
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] mb-8">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-3">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Verifikasi Berhasil • Sesi Aktif</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#273454] tracking-tight">
                            Selamat Datang, {{ auth()->user()->name }}! 👋
                        </h1>
                        <p class="text-slate-500 text-sm mt-1">
                            Anda telah berhasil melewati proses validasi & verifikasi autentikasi Livewire di Mochimod-Id.
                        </p>
                    </div>

                    <a href="{{ route('login') }}" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors duration-200">
                        <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Lihat Login Page</span>
                    </a>
                </div>
            </div>

            <!-- Info Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Card 1 -->
                <div class="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 rounded-xl bg-indigo-50 text-[#374272] flex items-center justify-center mb-4">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username Pengguna</span>
                    <p class="text-lg font-bold text-slate-800 mt-1">{{ auth()->user()->username ?? '-' }}</p>
                    <p class="text-xs text-slate-500 mt-1">Digunakan untuk login ke sistem</p>
                </div>

                <!-- Card 2 -->
                <div class="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                    </div>
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Akun</span>
                    <p class="text-lg font-bold text-slate-800 mt-1 truncate">{{ auth()->user()->email }}</p>
                    <p class="text-xs text-slate-500 mt-1">Email terdaftar di database</p>
                </div>

                <!-- Card 3 -->
                <div class="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                    </div>
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metode Keamanan</span>
                    <p class="text-lg font-bold text-slate-800 mt-1">Livewire + Bcrypt</p>
                    <p class="text-xs text-slate-500 mt-1">Dilengkapi proteksi Rate Limiting</p>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="py-6 text-center text-xs text-slate-400 border-t border-slate-200/50">
            &copy; {{ date('Y') }} Mochimod-Id. Hak Cipta Dilindungi.
        </footer>
    </body>
</html>
