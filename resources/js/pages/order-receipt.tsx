import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import AppLayout from "@/layouts/main-layout";

interface OrderItem {
    id: number;
    product_name: string;
    price: string;
    quantity: number;
    subtotal: string;
}

interface Order {
    id: number;
    status: string;
    payment_method: string;
    subtotal: string;
    total: string;
    created_at: string;
    items: OrderItem[];
}

interface Props {
    order: Order;
}

function formatRupiah(value: string | number): string {
    return Number(value).toLocaleString("id-ID");
}

function formatPaymentMethod(method: string): string {
    return method === "qris" ? "QRIS" : "Tunai / Cash";
}

export default function OrderReceipt({ order }: Props) {
    function printReceipt() {
        window.print();
    }

    return (
        <>
            <Head title={`Receipt #${order.id}`} />

            <main className="min-h-[90vh] bg-[#FBF9F7] p-4 sm:p-8">
                <section className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm print:max-w-none print:shadow-none">
                    <div className="text-center">
                        <p className="text-sm font-bold tracking-[0.2em] text-accent">
                            MOCHIMOD
                        </p>
                        <h1 className="mt-2 text-xl font-bold text-slate-800">
                            Pembayaran Berhasil
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Receipt #{order.id}
                        </p>
                        <p className="text-xs text-slate-400">
                            {new Date(order.created_at).toLocaleString("id-ID")}
                        </p>
                    </div>

                    <div className="my-6 space-y-3 border-y border-dashed border-gray-300 py-5">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between gap-4 text-sm"
                            >
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {item.product_name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {item.quantity} x Rp{" "}
                                        {formatRupiah(item.price)}
                                    </p>
                                </div>
                                <p className="font-medium text-slate-700">
                                    Rp {formatRupiah(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>Rp {formatRupiah(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-slate-800">
                            <span>Total</span>
                            <span>Rp {formatRupiah(order.total)}</span>
                        </div>
                        <div className="flex justify-between pt-2 text-xs">
                            <span>Metode pembayaran</span>
                            <span>
                                {formatPaymentMethod(order.payment_method)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3 print:hidden">
                        <Link
                            href="/pos"
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Kembali ke POS
                        </Link>
                        <button
                            type="button"
                            onClick={printReceipt}
                            className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                        >
                            Cetak Receipt
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
}

OrderReceipt.layout = (page: ReactNode) => (
    <AppLayout>{page}</AppLayout>
);
