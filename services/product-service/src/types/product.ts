export interface Product {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
}

export type Products = Product[];

export interface ProductNotFound {
  message: "Product not found";
}
