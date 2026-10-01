<div class="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden"
    style="background: radial-gradient(circle at 50% 40%, #FCF9F7 0%, #FAF5F1 60%, #F5EEE8 100%);">

    <!-- Ambient Subtle Glows -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none">
    </div>

    <!-- Login Card Container -->
    <div class="w-full max-w-[410px] relative z-10">

        <!-- Main Card -->
        <div
            class="bg-white rounded-[26px] p-7 sm:p-9 shadow-[0_20px_45px_rgba(220,185,170,0.18),0_4px_16px_rgba(0,0,0,0.03)] border border-[#F3ECE6] transition-all duration-300">

            <!-- Top Icon Badge -->
            <div class="flex justify-center mb-5">
                <div
                    class="w-[58px] h-[58px] rounded-2xl bg-gradient-to-b from-[#FFA785] to-[#FF8462] shadow-[0_8px_20px_rgba(255,132,98,0.35)] flex items-center justify-center transform transition-transform duration-200">
                    <!-- Padlock SVG Icon matching Figma -->
                    <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M12 2.25a4.75 4.75 0 0 0-4.75 4.75v2.25H6.5A2.75 2.75 0 0 0 3.75 12v7A2.75 2.75 0 0 0 6.5 21.75h11A2.75 2.75 0 0 0 20.25 19v-7a2.75 2.75 0 0 0-2.75-2.75h-.75V7A4.75 4.75 0 0 0 12 2.25Zm2.75 7V7a2.75 2.75 0 0 0-5.5 0v2.25h5.5ZM12 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
            </div>

            <!-- Title -->
            <h1 class="text-center text-[22px] font-bold text-[#273454] tracking-tight mb-6">
                Login
            </h1>

            <!-- Global Error Banner -->
            @if ($errorMessage)
                <div
                    class="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-start gap-2.5 animate-shake">
                    <svg class="w-4 h-4 text-rose-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div class="flex-1 font-medium leading-relaxed">
                        {{ $errorMessage }}
                    </div>
                </div>
            @endif

            <!-- Global Success Banner -->
            @if ($successMessage)
                <div
                    class="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs flex items-start gap-2.5">
                    <svg class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div class="flex-1 font-medium leading-relaxed">
                        {{ $successMessage }}
                    </div>
                </div>
            @endif

            <!-- Login Form -->
            <form wire:submit.prevent="login" novalidate class="space-y-4">

                <!-- Field 1: Username -->
                <div>
                    <label for="username" class="block text-[13px] font-semibold text-[#576885] mb-1.5">
                        Username
                    </label>

                    <div
                        class="relative flex items-center rounded-xl bg-[#F8FAFC] border @error('username') border-rose-400 bg-rose-50/20 @else border-[#E2E8F0] @enderror hover:border-slate-300 focus-within:!border-[#374272] focus-within:!bg-white focus-within:ring-4 focus-within:ring-[#374272]/10 transition-all duration-200 group">
                        <!-- Icon Left: Badge / Calendar Icon from Figma -->
                        <div
                            class="absolute left-3.5 text-slate-400 group-focus-within:text-[#374272] pointer-events-none transition-colors duration-200">
                            <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <g id="User / User_01">
                                    <path id="Vector"
                                        d="M19 21C19 17.134 15.866 14 12 14C8.13401 14 5 17.134 5 21M12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7C16 9.20914 14.2091 11 12 11Z"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </g>
                            </svg>
                        </div>

                        <!-- Input Element -->
                        <input type="text" id="username" wire:model.live.debounce.300ms="username"
                            placeholder="Masukkan username" autocomplete="username"
                            class="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-colors" />
                    </div>

                    <!-- Real-time Validation Message -->
                    @error('username')
                        <p class="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fadeIn">
                            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ $message }}</span>
                        </p>
                    @enderror
                </div>

                <!-- Field 2: Password -->
                <div>
                    <!-- Header with Label and 6-Digit Pin hint -->
                    <div class="flex items-center justify-between mb-1.5">
                        <label for="password" class="text-[13px] font-semibold text-[#576885]">
                            Password
                        </label>
                        <span class="text-[11px] font-medium text-slate-400 select-none">
                            6-Digit Pin
                        </span>
                    </div>

                    <div
                        class="relative flex items-center rounded-xl bg-[#F8FAFC] border @error('password') border-rose-400 bg-rose-50/20 @else border-[#E2E8F0] @enderror hover:border-slate-300 focus-within:!border-[#374272] focus-within:!bg-white focus-within:ring-4 focus-within:ring-[#374272]/10 transition-all duration-200 group">
                        <!-- Icon Left: Padlock Icon -->
                        <div
                            class="absolute left-3.5 text-slate-400 group-focus-within:text-[#374272] pointer-events-none transition-colors duration-200">
                            <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>

                        <!-- Input Element with Dynamic Show/Hide State -->
                        <div x-data="{ showPassword: false }" class="flex items-center">
                            <input id="password" :type="showPassword ? 'text' : 'password'"
                                wire:model.live.debounce.300ms="password" placeholder="Masukkan password"
                                autocomplete="current-password"
                                class="w-full bg-transparent py-3 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-colors" />

                            <!-- Toggle Eye Icon (Password Visibility) -->
                            <button type="button" @click="showPassword = !showPassword"
                                :title="showPassword ? 'Sembunyikan password' : 'Lihat password'"
                                class="absolute right-2.5 p-1.5 text-slate-400 hover:text-[#374272] hover:bg-slate-200/50 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none">

                                <!-- Eye Open (Password Visible) -->
                                <svg x-show="showPassword" class="w-[18px] h-[18px] text-[#374272]" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>

                                <!-- Eye Crossed / Slashed (Password Hidden) -->
                                <svg x-show="!showPassword" class="w-[18px] h-[18px]" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                                    <path
                                        d="M17.479 17.499A10.75 10.75 0 0 1 2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.417-5.38" />
                                    <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>

                            </button>
                        </div>
                    </div>

                    <!-- Real-time Validation Message -->
                    @error('password')
                        <p class="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-fadeIn">
                            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ $message }}</span>
                        </p>
                    @enderror
                </div>

                <!-- Submit Button -->
                <div class="pt-2">
                    <button type="submit" wire:loading.attr="disabled"
                        class="w-full py-3.5 px-4 rounded-xl bg-[#374272] hover:bg-[#2C365E] active:scale-[0.99] text-white text-sm font-semibold shadow-md shadow-[#374272]/20 hover:shadow-lg hover:shadow-[#374272]/30 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-wait group">
                        <!-- Normal State Text & Arrow -->
                        <span wire:loading.remove wire:target="login" class="flex items-center gap-2">
                            <span>Masuk ke Sistem</span>
                            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>

                        <!-- Loading State Spinner -->
                        <span wire:loading.flex wire:target="login"
                            class="flex flex-row flex-nowrap items-center justify-center gap-2">
                            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10"
                                    stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <span>Memverifikasi...</span>
                        </span>
                    </button>
                </div>
            </form>

        </div>

        <!-- Interactive Demo Quick Fill Helper -->
        <div class="mt-5 text-center">
            <div
                class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur border border-slate-200/60 shadow-xs text-xs text-slate-500">
                <span>Akun Demo:</span>
                <button type="button" wire:click="fillDemo"
                    class="font-semibold text-[#374272] hover:text-orange-600 underline underline-offset-2 transition-colors cursor-pointer"
                    title="Klik untuk mengisi data secara otomatis">
                    admin123 / mochimod123
                </button>
                <span class="text-[10px] text-slate-400">(klik untuk isi)</span>
            </div>
        </div>

    </div>

</div>
