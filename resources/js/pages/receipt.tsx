import { Head, Link } from "@inertiajs/react";
import type React from "react";
import AppLayout from "@/layouts/main-layout";

interface TransactionItem {
    id: number;
    product_name: string;
    product_price: string | number;
    quantity: number;
    subtotal: string | number;
}

interface Transaction {
    id: number;
    transaction_code: string;
    payment_method: "cash" | "qris";
    total_amount: string | number;
    amount_paid: string | number;
    change_amount: string | number;
    created_at: string;
    items: TransactionItem[];
}

interface ReceiptProps {
    transaction: Transaction;
}

function currency(value: string | number): string {
    return Number(value).toLocaleString("id-ID");
}

export default function Receipt({ transaction }: ReceiptProps) {
    return (
        <>
            <Head title={`Receipt ${transaction.transaction_code}`} />
            <main className="mx-auto max-w-2xl p-6">
                <div className="rounded-2xl bg-white p-6 shadow">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold">Mochimod</h1>
                        <p className="text-sm text-slate-500">
                            {transaction.transaction_code}
                        </p>
                    </div>

                    <div className="space-y-3 border-b pb-4">
                        {transaction.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between gap-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.product_name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {item.quantity} x Rp{" "}
                                        {currency(item.product_price)}
                                    </p>
                                </div>
                                <p>Rp {currency(item.subtotal)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 py-4 text-sm">
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>Rp {currency(transaction.total_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Bayar</span>
                            <span>Rp {currency(transaction.amount_paid)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Kembalian</span>
                            <span>Rp {currency(transaction.change_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Metode</span>
                            <span>{transaction.payment_method.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="flex-1 rounded-lg border px-4 py-2 text-center"
                        >
                            Kembali ke POS
                        </Link>
                        <a
                            href={`/checkout/${transaction.id}/receipt/pdf`}
                            className="flex-1 rounded-lg bg-accent px-4 py-2 text-center text-white"
                        >
                            Download PDF
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}

Receipt.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
