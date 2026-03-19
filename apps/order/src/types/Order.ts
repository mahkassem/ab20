export interface Order {
  id: number;
  userId: number;
  status: string;
  notes: string | null;
  totalAmount: number;
  createdAt: string;
}

export interface OrderLine {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CreateOrderLineInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  user: {
    id?: number;
    name?: string;
    email?: string;
  };
  notes?: string;
  lines: CreateOrderLineInput[];
}

export interface OrderWithLines extends Order {
  lines: OrderLine[];
}
