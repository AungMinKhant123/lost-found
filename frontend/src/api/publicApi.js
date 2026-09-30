import api from "./axiosClient";

export const getLatestItems = async () => {
  const response = await api.get("/public/items", {
    params: { page: 1, limit: 6 },
  });
  return response.data.data;
};

export const getItems = async (params = {}) => {
  const response = await api.get("/public/items", {
    params,
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};

export const getColors = async () => {
  const response = await api.get("/colors");

  return response.data;
};
