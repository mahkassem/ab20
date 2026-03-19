export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  inventoryCount: number;
  storeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  inventoryCount: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  inventoryCount?: number;
  storeId?: number;
}
