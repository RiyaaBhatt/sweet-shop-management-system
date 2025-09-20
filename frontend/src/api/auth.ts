import { api } from "./config";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  role?: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>("/auth/login", credentials),

  register: (data: RegisterData) =>
    api.post<AuthResponse>("/auth/register", data),

  logout: () => {
    localStorage.removeItem("token");
    api.post("/auth/logout");
  },

  getCurrentUser: () => api.get<AuthResponse>("/auth/me"),
};
