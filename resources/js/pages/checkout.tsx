import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { useState } from "react";
import type { CartItem } from "@/types";

type PaymentMethod = "cash" | "qris";

interface CheckoutProps {
    items: CartItem[];
    subtotal: number;
    onClose: () => void;
    onSuccess: () => void;
}

interface CheckoutForm {
    items: {
        product_id: number;
        quantity: number;
    }[];
    payment_method: PaymentMethod;
    amount_paid: number;
}

export default function Checkout({
    items,
    subtotal,
    onClose,
    onSuccess,
}: CheckoutProps) {
    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>("cash");
    const [cashReceived, setCashReceived] = useState(0);
    const [showCancelConfirmation, setShowCancelConfirmation] =
        useState(false);

    const form = useForm<CheckoutForm>({
        items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
        })),
        payment_method: "cash",
        amount_paid: 0,
    });

    function selectPaymentMethod(method: PaymentMethod) {
        setPaymentMethod(method);
        form.setData("payment_method", method);
    }

    function submitCheckout(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.setData("amount_paid", paymentMethod === "cash" ? cashReceived : subtotal);
        form.post("/checkout/confirm", {
            preserveScroll: true,
            onSuccess,
        });
    }

    function formatRupiah(value: number) {
        return value.toLocaleString("id-ID");
    }

    const change =
        cashReceived >= subtotal ? cashReceived - subtotal : 0;
    const isCashEnough =
        paymentMethod === "cash" && cashReceived >= subtotal;
    const canSubmit =
        paymentMethod === "qris" || isCashEnough;

    const quickAmounts = [
        subtotal,
        50000,
        100000,
        150000,
        200000,
    ].filter(
        (amount, index, amounts) =>
            amount >= subtotal && amounts.indexOf(amount) === index,
    );

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
                <form
                    onSubmit={submitCheckout}
                    className="w-full max-w-[560px] rounded-2xl bg-white shadow-2xl"
                >
                    <div className="border-b border-gray-200 px-6 py-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                            Pembayaran
                        </p>
                        <h2 className="text-lg font-bold text-slate-800">
                            Konfirmasi Pembayaran
                        </h2>
                    </div>

                    <div className="space-y-5 p-6">
                        <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4">
                            <span className="text-sm text-slate-500">
                                Total pembayaran
                            </span>
                            <strong className="text-lg text-accent">
                                Rp {formatRupiah(subtotal)}
                            </strong>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-700">
                                Metode pembayaran
                            </p>
                            {(
                                [
                                    ["cash", "Tunai / Cash", "Pembayaran di kasir"],
                                    ["qris", "QRIS Dinamis", "Bayar menggunakan QRIS"],
                                ] as const
                            ).map(([value, label, description]) => (
                                <label
                                    key={value}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 ${
                                        paymentMethod === value
                                            ? "border-accent bg-indigo-50"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <span>
                                        <strong className="block text-sm text-slate-800">
                                            {label}
                                        </strong>
                                        <span className="text-xs text-slate-500">
                                            {description}
                                        </span>
                                    </span>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value={value}
                                        checked={paymentMethod === value}
                                        onChange={() =>
                                            selectPaymentMethod(value)
                                        }
                                    />
                                </label>
                            ))}
                        </div>

                        {paymentMethod === "cash" ? (
                            <div className="space-y-3">
                                <label
                                    htmlFor="cash-received"
                                    className="block text-sm font-semibold text-slate-700"
                                >
                                    Uang pelanggan
                                </label>
                                <input
                                    id="cash-received"
                                    type="number"
                                    min={subtotal}
                                    value={cashReceived || ""}
                                    onChange={(event) =>
                                        setCashReceived(
                                            Number(event.target.value),
                                        )
                                    }
                                    placeholder="Masukkan nominal"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    {quickAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() =>
                                                setCashReceived(amount)
                                            }
                                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-accent"
                                        >
                                            Rp {formatRupiah(amount)}
                                        </button>
                                    ))}
                                </div>
                                {cashReceived > 0 && !isCashEnough && (
                                    <p className="text-sm text-red-600">
                                        Uang pelanggan belum mencukupi.
                                    </p>
                                )}
                                {isCashEnough && (
                                    <div className="flex justify-between rounded-lg bg-emerald-50 p-3 text-sm">
                                        <span>Kembalian pelanggan</span>
                                        <strong className="text-emerald-700">
                                            Rp {formatRupiah(change)}
                                        </strong>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex min-h-40 items-center justify-center rounded-xl bg-slate-50 text-center text-sm text-slate-500">
                                QR code QRIS akan ditampilkan di sini.
                            </div>
                        )}

                        {form.errors.items && (
                            <p className="text-sm text-red-600">
                                {form.errors.items}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between border-t border-gray-200 px-6 py-4">
                        <button
                            type="button"
                            onClick={() => setShowCancelConfirmation(true)}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                        >
                            Kembali ke Pesanan
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit || form.processing}
                            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {form.processing
                                ? "Memproses..."
                                : "Bayar dan Selesaikan"}
                        </button>
                    </div>
                </form>
            </div>

            {showCancelConfirmation && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
                        <h2 className="font-bold text-slate-800">
                            Batalkan pembayaran?
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Isi keranjang tetap tersimpan.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCancelConfirmation(false)
                                }
                                className="rounded-lg border px-4 py-2 text-sm"
                            >
                                Tidak
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white"
                            >
                                Ya, batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
