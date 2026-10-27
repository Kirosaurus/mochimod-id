import React from "react";
import AppLayout from "@/layouts/main-layout";

export default function SalesReport() {
    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
        </main>
    );
}

SalesReport.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
