import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // No response from server
    if (!error.response) {
      return Promise.reject(error);
    }

    // If refresh request itself failed,
    // do NOT try to refresh again.
    if (originalRequest?.url?.includes("/auth/refresh")) {
      useAuthStore.getState().logout();

      return Promise.reject(error);
    }

    // Only try refresh once for a 401
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");

        // Refresh succeeded, retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → session is no longer valid
        useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
