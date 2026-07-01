export interface GetProductQuery {
    page?: number
    limit?: number

    search?: string
}

export interface Product {
    id: string;
    name: string;
    brandName?: string;
}