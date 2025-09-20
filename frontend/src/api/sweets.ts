import { api } from "./config";

export interface Sweet {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  quantity: number;
  isAvailable: boolean;
  featured: boolean;
  sugarFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetSweetsParams {
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateSweetInput {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: File;
  stock: number;
  isAvailable: boolean;
}

export interface UpdateSweetInput extends Partial<CreateSweetInput> {
  id: string;
}

export const sweetsApi = {
  getAllSweets: (params?: GetSweetsParams) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set("search", params.search);
    if (params?.category) queryParams.set("category", params.category);
    if (params?.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.set("sortOrder", params.sortOrder);
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());

    const query = queryParams.toString();
    return api.get<PaginatedResponse<Sweet>>(
      `/sweets${query ? `?${query}` : ""}`
    );
  },

  getSweetById: (id: number) => api.get<Sweet>(`/sweets/${id}`),

  createSweet: (data: CreateSweetInput) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return api.post<Sweet>("/sweets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateSweet: ({ id, ...data }: UpdateSweetInput) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return api.put<Sweet>(`/sweets/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteSweet: (id: string) => api.delete(`/sweets/${id}`),

  purchaseSweet: (id: number | string, quantity = 1) =>
    api.post(`/sweets/${id}/purchase`, { quantity }),

  restockSweet: (id: number | string, quantity = 1) =>
    api.post(`/sweets/${id}/restock`, { quantity }),
};
