export interface ProductRow {
  id: number;
  name: string;
  description: string | null;
  price: number;
  inventory_count: number;
  created_at: string;
  updated_at: string;
  store_id: number;
}

export interface UserRow {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: number;
  user_id: number;
  status: string;
  notes: string | null;
  total_amount: number;
  created_at: string;
}

export interface OrderLineRow {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
}
