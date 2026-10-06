import { Head } from "@inertiajs/react";
import React from "react";
import AppLayout from "@/layouts/main-layout";

export default function SalesReport() {
    return (
        <>
            <Head title="Laporan Penjualan - Mochimod" />
            
        </>
    );
}

SalesReport.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);
