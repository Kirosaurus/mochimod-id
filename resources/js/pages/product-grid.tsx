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
                No Product Found
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto no-scrollbar">
            <div className="grid grid-flow-row grid-cols-6 auto-rows-auto gap-4 p-[2px]">
                {products.map((product) => (
                    <button 
                        key={product.id}
                        onClick={() => onAdd(product)}
                        className="flex flex-col w-full h-auto bg-white rounded-[12px] p-[12px] border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent cursor-pointer duration-300 ease-in-out"
                    >
                        <div className="flex flex-col gap-[4px]">
                            <div className="w-full h-[128px] shrink-0 bg-black rounded-[8px]"></div>
                            <div className="flex flex-row w-fill items-center justify-between">
                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                    <p className="text-success font-bold text-small">
                                        Stok: 24 pcs
                                    </p>
                                </div>
                                <div>
                                    <p className="font-bold text-small text-gray-600">
                                        #DF-01
                                    </p>
                                </div>
                            </div>
                            <div className="h-[75px]">
                                <p className="font-bold text-normal">
                                    Daifuku Stroberi Coklat
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                            <div className="flex flex-row gap-[14px] justify-between">
                                <div className="flex flex-col">
                                    <p className="text-small">Harga</p>
                                    <p className="text-normal font-bold text-nowrap">
                                        Rp 8.000
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
