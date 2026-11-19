<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="/favicon.ico?v=20261119" sizes="any">
        <link rel="icon" href="/favicon.png?v=20261119" type="image/png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20261119">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased bg-[#FBF9F7]">
        <x-inertia::app />
    </body>
</html>
