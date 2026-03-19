export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  inventoryCount: number;
  createdAt: string;
  updatedAt: string;
  store_id: number;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  inventoryCount: number;
  store_id: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  inventoryCount?: number;
  store_id: number;
}
