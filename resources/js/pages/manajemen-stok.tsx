import { Head } from "@inertiajs/react";
import React from "react";
import AppLayout from "@/layouts/main-layout";

export default function Test() {
    return (
        <>
            <Head title="Manajemen Stok - Mochimod" />

            <main>
                <div>
                    
                </div>
            </main>
        </>
    );
}

Test.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
