export interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreRow {
  id: number;
  name: string;
  description: string | null;
  owner_user_id: number;
  category_id: number | null;
  created_at: string;
  updated_at: string;
}
