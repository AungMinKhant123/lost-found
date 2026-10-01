import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    // Never refresh auth endpoints themselves
    if (
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Don't refresh when already logged out
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      return Promise.reject(error);
    }

    // Retry only once
    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await api.post("/auth/refresh");

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();

      return Promise.reject(refreshError);
    }
  },
);

export default api;
