import { CartItem } from "@/types";

interface cartItem{
    product: {id: number, name: string, price: string, stock: number};
    quantity: number;
}
interface props{
    items: cartItem[];
    subtotal: number;
    onRemove: (productId: number) => void;
    onSetQuantity: (productId: number, qty: number) => void;
    onClear: () => void 
}

export default function CartPanel({ items, subtotal, onRemove, onSetQuantity, onClear }:props) {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between border-b pb-3">
                <h2 className="font-semibold text-lg text-slate-800">Cart</h2>
                {items.length > 0 && (
                    <button onClick={onClear} className="text-xs text-muted-foreground hover:text-red-500 transition-colors">
                        Clear all
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {items.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">
                        No items yet
                    </p>
                ) : (
                    items.map(item => (
                        <div key={item.product.id} className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.product.name}</p>
                                <p className="text-xs text-slate-400">{item.product.price} each</p>
                            </div>
                            <input
                                type="number"
                                min={1}
                                max={item.product.stock}
                                value={item.quantity}
                                onChange={(e => onSetQuantity(item.product.id, parseInt(e.target.value) || 0))}
                                className="w-16 text-center border rounded-md py-1"
                            />
                            <button onClick={() => onRemove(item.product.id)} className="p-1 hover:bg-slate-100 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 24 24">
                                    <path fill="none" stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-base font-bold text-slate-800">
                    <span>Total</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <button 
                    className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                    disabled={items.length === 0}
                    // onClick={onCheckout}
                >
                    Checkout
                </button>
            </div>
        </div>
    )
}