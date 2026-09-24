import api from "./axiosClient";

export const signup = async (data) => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await api.patch("/auth/profile", formData);

  return response.data;
};

export async function logoutUser() {
  const response = await api.post("/auth/logout");

  return response.data;
}

export async function changePassword(data) {
  const response = await api.patch("/auth/password", data);

  return response.data;
}
