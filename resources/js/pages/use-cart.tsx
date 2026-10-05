import { CartItem, Product } from "@/types";
import { useMemo, useReducer } from "react";

type cartAction = 
    | {type: "ADD"; product: Product}
    | {type: "REMOVE"; productId: number}
    | {type: "SET_QTY"; productId: number, quantity: number}
    | {type: "CLEAR";}

    function cartReducer(state:CartItem[], action:cartAction): CartItem[] {
        switch (action.type) {
            case "ADD":
                {
                    const existing = state.find(i => i.product.id === action.product.id)
                    if (existing) {
                        return state.map(i => 
                            i.product.id === action.product.id
                            ? {...i, quantity: i.quantity + 1}
                            : i
                        )
                    }
                    return [...state, {product: action.product, quantity: 1}]
                }

            case "REMOVE":
                return state.filter(i => i.product.id !== action.productId)

            case "SET_QTY":
                {
                    if (action.quantity <= 0) {
                        return state.filter(i => i.product.id !== action.productId)
                    }
                    return state.map(i => 
                        i.product.id === action.productId
                        ? {...i, quantity: action.quantity}
                        : i
                    )
                }

            case "CLEAR":
                return [];

            default:
                return state
        }
    }

    export function useCart() {
        const [items, dispatch] = useReducer(cartReducer, []);

        const subTotal = useMemo(
            () => items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0),
            [items]
        )

        return {
            items,
            subTotal,
            addItem: (product: Product) => dispatch({type: "ADD", product}),
            removeItem: (productId: number) => dispatch({type: "REMOVE", productId}),
            setQuantity: (productId: number, quantity: number) => dispatch({type: "SET_QTY", productId, quantity}),
            clear: () => dispatch({type: 'CLEAR'})
        }
    }