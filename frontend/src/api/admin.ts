import { api } from "./config";

export const adminApi = {
  getStats: () => api.get(`/admin/stats`),
  getTopProducts: (limit = 10) =>
    api.get(`/admin/reports/top-products?limit=${limit}`),
  getSalesByDay: (days = 30) =>
    api.get(`/admin/reports/sales-by-day?days=${days}`),
  getSalesByRange: (from: string, to: string) =>
    api.get(`/admin/reports/sales-by-day`, { params: { from, to } }),
  getOrders: (params?: any) => api.get(`/admin/orders`, { params }),
  updateOrderStatus: (id: number, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status }),
  getOrder: (id: number) => api.get(`/admin/orders/${id}`),
};
