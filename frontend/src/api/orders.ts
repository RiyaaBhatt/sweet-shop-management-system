import { api } from "./config";

export interface OrderItemPayload {
  productId: number;
  quantity: number;
  price: number;
}

export interface DeliveryPayload {
  recipientName: string;
  deliveryAddress: string;
  phoneNumber: string;
  notes?: string;
}

export const ordersApi = {
  createOrder: (items: OrderItemPayload[], delivery?: DeliveryPayload) =>
    api.post(`/orders`, { items, delivery }),
  getMyOrders: () => api.get(`/orders`),
  getOrder: (id: number | string) => api.get(`/orders/${id}`),
};
