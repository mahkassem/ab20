export interface Store {
  id: number;
  name: string;
  description: string | null;
  ownerUserId: number;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreInput {
  name: string;
  description?: string;
  ownerUserId: number;
  categoryId?: number;
}

export interface UpdateStoreInput {
  name?: string;
  description?: string;
  ownerUserId?: number;
  categoryId?: number | null;
}
