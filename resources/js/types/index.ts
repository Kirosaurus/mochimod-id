export type * from './auth';

export interface Category{
    id: number,
    name: string,
    description: string|null
}

export interface Product{
    id: number,
    category_id: number,
    name: string,
    description: string|null,
    price: string,
    stock: number,
    image: string|null,
    is_active: boolean,
    category: Category
}
export interface CartItem{
    product: Product,
    quantity: number
}