import { Product } from "@/types";

const productImageByName: Record<string, string> = {
    "Mochi Cokelat": "/images/products/mochi-cokelat.jpg",
    "Mochi Stroberi": "/images/products/mochi-stroberi.jpg",
    "Mochi Matcha": "/images/products/mochi-matcha.jpg",
    "Mochi Taro": "/images/products/mochi-taro.jpg",
    "Mochi Mangga": "/images/products/mochi-mangga.jpg",
    "Mochi Keju": "/images/products/mochi-keju.jpg",
    "Jus Jeruk": "/images/products/jus-jeruk.jpg",
    "Jus Mangga": "/images/products/jus-mangga.jpg",
    "Jus Alpukat": "/images/products/jus-alpukat.jpg",
    "Jus Stroberi": "/images/products/jus-stroberi.jpg",
};

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
        <div className="w-full overflow-x-auto no-scrollbar">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 p-[2px] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:gap-4">
                {products.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => onAdd(product)}
                        className="flex h-full min-w-0 flex-col justify-between w-full bg-white rounded-[12px] p-2.5 sm:p-[12px] text-left border border-gray-200 shadow-[0px_1px_10px_0px_var(--color-gray-200)] hover:translate-y-[-2px] hover:border-accent active:scale-[0.98] cursor-pointer duration-300 ease-in-out"
                    >
                        <div className="flex flex-col gap-[4px]">
                            <div className="w-full aspect-[4/3] shrink-0 rounded-[8px] bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100">
                                <img
                                    src={
                                        product.image
                                            ? product.image.startsWith("/")
                                                ? product.image
                                                : `/storage/${product.image}`
                                            : productImageByName[product.name]
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                        event.currentTarget.parentElement?.classList.add(
                                            "bg-orange-50",
                                        );
                                    }}
                                />
                            </div>
                            <div className="flex flex-row w-full items-center justify-between">
                                <div className="flex flex-row w-auto bg-success-bg rounded-[8px] py-[2px] px-[6px]">
                                    <p className="text-success font-bold text-small">
                                        Stok : {product.stock}
                                    </p>
                                </div>
                            </div>
                            <div className="flex min-h-[2.75rem] sm:min-h-[4.5rem]">
                                <p className="font-bold text-sm sm:text-normal text-left line-clamp-2 sm:line-clamp-3">
                                    {product.name}
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="h-[1px] bg-gray-200 mb-[8px]"></div>
                            <div className="flex flex-row gap-2 sm:gap-[14px] justify-between">
                                <div className="flex flex-col text-left">
                                    <p className="text-small text-slate-500">
                                        Harga
                                    </p>
                                    <p className="text-sm sm:text-normal font-bold text-nowrap text-slate-800">
                                        Rp{" "}
                                        {Math.floor(Number(product.price)).toLocaleString("id-ID")}
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