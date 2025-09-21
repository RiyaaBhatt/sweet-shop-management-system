import { api } from "./config";

export const cartApi = {
  reserve: (productId: number | string, quantity = 1) =>
    api.post(`/cart/reserve`, { productId, quantity }),
};
