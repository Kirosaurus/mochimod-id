import { Product } from "@/types";

interface cartItem {
    product: Product;
    quantity: number;
}

interface props {
    products: Product[];
    onAdd: (product: Product) => void;
}

export default function ProductGrid({ products, onAdd }: props) {
    if (products.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
                Tidak ada produk yang tersedia
            </div>
        );
    }

    return (
        <div className="w-full min-w-0">
            <div className="grid auto-rows-auto grid-cols-2 gap-3 p-[2px] sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-6">
                {products.map((product) => (
                    <button 
                        key={product.id}
                        onClick={() => onAdd(product)}
                        className="flex h-full w-full min-w-0 cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-2.5 shadow-[0px_1px_10px_0px_var(--color-gray-200)] transition duration-300 ease-in-out hover:-translate-y-0.5 hover:border-accent sm:p-3"
                    >
                        <div className="flex flex-col gap-[4px]">
                            <div className="h-20 w-full shrink-0 rounded-lg bg-black sm:h-28"></div>
                            <div className="flex w-full items-center justify-between">
                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                    <p className="text-success font-bold text-small">
                                        Stok: {product.stock}
                                    </p>
                                </div>
                            </div>
                            <div className="flex min-h-14 sm:h-[75px]">
                                <p className="line-clamp-2 text-sm font-bold sm:text-base">
                                    {product.name}
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                            <div className="flex flex-row gap-[14px] justify-between">
                                <div className="flex flex-col text-left">
                                    <p className="text-small">Harga</p>
                                    <p className="truncate text-sm font-bold sm:text-base">
                                        Rp {product.price}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
