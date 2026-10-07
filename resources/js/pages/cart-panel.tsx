import { CartItem } from "@/types";

interface cartItem {
    product: { id: number; name: string; price: string; stock: number };
    quantity: number;
}
interface props {
    items: cartItem[];
    subtotal: number;
    onRemove: (productId: number) => void;
    onSetQuantity: (productId: number, qty: number) => void;
    onClear: () => void;
}

export default function CartPanel({
    items,
    subtotal,
    onRemove,
    onSetQuantity,
    onClear,
}: props) {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between border-b border-gray-400 pb-3">
                <h2 className="font-semibold text-lg text-slate-800">
                    Keranjang
                </h2>
                {items.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-3 p-2 content-start">
                {items.length === 0 ? (
                    <>
                    <div className="flex h-full flex-col items-center justify-center">

                        <div>
                            <svg
                                width="240"
                                height="220"
                                viewBox="0 0 270 245"
                                fill="none"
                            >
                                <path
                                    d="M181.671 87.8014C162.532 87.8014 143.051 87.0239 124.827 81.9477C106.946 76.9859 90.5281 67.3594 75.8941 56.2238C66.3133 48.9754 57.6015 43.1904 45.1625 44.0593C32.9935 44.7178 21.3566 49.2619 11.9615 57.0241C-3.86154 70.8807 -1.48351 96.5589 4.85029 114.531C14.3624 141.673 43.3104 160.583 67.9139 172.816C96.336 187.016 127.571 195.27 158.874 200.003C186.313 204.188 221.572 207.206 245.352 189.302C267.189 172.816 273.179 135.225 267.829 109.844C266.531 102.346 262.538 95.5804 256.602 90.8196C241.259 79.5926 218.37 87.0925 201.13 87.4584C194.727 87.5956 188.21 87.7556 181.671 87.8014Z"
                                    fill="#F2F2F2"
                                />
                                <path
                                    d="M135.757 244.5C182.116 244.5 219.697 242.155 219.697 239.264C219.697 236.372 182.116 234.027 135.757 234.027C89.3981 234.027 51.8169 236.372 51.8169 239.264C51.8169 242.155 89.3981 244.5 135.757 244.5Z"
                                    fill="#F2F2F2"
                                />
                                <path
                                    d="M17.3123 37.3823L47.0377 34.8671C50.7444 34.5425 54.4501 35.5011 57.5345 37.5823C60.6189 39.6636 62.8948 42.7412 63.9812 46.2999L92.4719 141.65L86.8926 151.642C85.4596 154.217 84.7521 157.132 84.8457 160.077C84.9393 163.022 85.8304 165.887 87.4241 168.365C89.0177 170.844 91.254 172.843 93.8947 174.15C96.5354 175.458 99.4813 176.024 102.418 175.788L216.518 166.093"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M68.2343 60.774L200.855 49.5241C202.162 49.4121 203.477 49.5958 204.703 50.0614C205.928 50.5269 207.034 51.2625 207.936 52.2136C208.839 53.1646 209.516 54.3067 209.917 55.555C210.318 56.8034 210.433 58.1261 210.253 59.4249L201.267 124.295C200.994 126.241 200.074 128.039 198.656 129.4C197.238 130.76 195.403 131.604 193.447 131.795L92.4719 141.65L68.2343 60.774Z"
                                    fill="white"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M115.109 197.648C121.057 197.648 125.879 192.827 125.879 186.879C125.879 180.931 121.057 176.109 115.109 176.109C109.161 176.109 104.339 180.931 104.339 186.879C104.339 192.827 109.161 197.648 115.109 197.648Z"
                                    fill="white"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M190.108 191.291C196.056 191.291 200.878 186.47 200.878 180.522C200.878 174.574 196.056 169.752 190.108 169.752C184.16 169.752 179.338 174.574 179.338 180.522C179.338 186.47 184.16 191.291 190.108 191.291Z"
                                    fill="white"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M40.8514 32.2927L12.8273 34.6706C10.3988 34.8767 8.5971 37.0124 8.80317 39.441C9.00923 41.8695 11.145 43.6712 13.5736 43.4652L41.5977 41.0873C44.0262 40.8812 45.8279 38.7454 45.6218 36.3169C45.4158 33.8883 43.28 32.0866 40.8514 32.2927Z"
                                    fill="#D2D2D2"
                                />
                                <path
                                    d="M124.072 110.873C124.619 106.7 126.576 102.839 129.619 99.9307C132.661 97.0226 136.607 95.2421 140.8 94.8844C144.994 94.5267 149.184 95.6134 152.675 97.9641C156.166 100.315 158.748 103.788 159.994 107.809"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M160.291 86.2008C161.706 86.2008 162.852 85.0542 162.852 83.6398C162.852 82.2254 161.706 81.0789 160.291 81.0789C158.877 81.0789 157.73 82.2254 157.73 83.6398C157.73 85.0542 158.877 86.2008 160.291 86.2008Z"
                                    fill="#BABABA"
                                />
                                <path
                                    d="M119.705 89.6305C121.119 89.6305 122.266 88.4839 122.266 87.0695C122.266 85.6551 121.119 84.5085 119.705 84.5085C118.29 84.5085 117.144 85.6551 117.144 87.0695C117.144 88.4839 118.29 89.6305 119.705 89.6305Z"
                                    fill="#BABABA"
                                />
                                <path
                                    d="M47.5636 183.7V193.556"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M42.6477 188.616H52.48"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M204.674 0.5V10.3323"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M199.758 5.41602H209.59"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M88.2646 29.8826V39.7148"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M83.3253 34.7986H93.1804"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M229.209 66.0335C230.497 66.0335 231.541 64.9893 231.541 63.7012C231.541 62.4131 230.497 61.3689 229.209 61.3689C227.921 61.3689 226.876 62.4131 226.876 63.7012C226.876 64.9893 227.921 66.0335 229.209 66.0335Z"
                                    fill="white"
                                    stroke="#BABABA"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M142.045 45.0654C143.283 45.0654 144.286 44.0622 144.286 42.8246C144.286 41.587 143.283 40.5837 142.045 40.5837C140.807 40.5837 139.804 41.587 139.804 42.8246C139.804 44.0622 140.807 45.0654 142.045 45.0654Z"
                                    fill="#CFCFCF"
                                />
                                <path
                                    d="M157.09 207.686C158.328 207.686 159.331 206.683 159.331 205.445C159.331 204.208 158.328 203.204 157.09 203.204C155.853 203.204 154.849 204.208 154.849 205.445C154.849 206.683 155.853 207.686 157.09 207.686Z"
                                    fill="#CFCFCF"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-400 text-center py-8">
                            Belum ada produk yang ditambahkan
                        </p>
                    </div>
                    </>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.product.id}
                            className="flex items-center gap-2"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {item.product.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {item.product.price} each
                                </p>
                            </div>
                            <input
                                type="number"
                                min={1}
                                max={item.product.stock}
                                value={item.quantity}
                                onChange={(e) =>
                                    onSetQuantity(
                                        item.product.id,
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                                className="w-16 text-center border rounded-md py-1"
                            />
                            <button
                                onClick={() => onRemove(item.product.id)}
                                className="p-1 hover:bg-slate-100 rounded"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-red-500"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className="space-y-3 border-t border-gray-400 pt-4">
                <div className="flex justify-between text-base font-bold text-slate-800">
                    <span>Total</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <button
                    className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                    disabled={items.length === 0}
                    // onClick={onCheckout}
                >
                    Konfirmasi Pembayaran
                </button>
            </div>
        </div>
    );
}
