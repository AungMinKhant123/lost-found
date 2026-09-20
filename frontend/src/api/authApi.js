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
