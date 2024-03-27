export interface ProductsResponse {
    totalElements: number;
    content: Products[];

}

export interface NewProducts {
    id: number;
    active: boolean;
    code: string;
    name: string;
    description: string;
    image: string;
    size: number;
    brand: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    category: number;
}

export interface Products {
    id: number;
    active: boolean;
    code: string;
    name: string;
    description: string;
    image: File | null;
    size: number;
    brand: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    category: Category;
}

export interface Category {
    id: number;
    nombre: string;
}
