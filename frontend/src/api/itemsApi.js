import api from "./axiosClient";

export const createItem = async (formData) => {
  const response = await api.post("/item/createNewPost", formData);

  return response.data;
};
