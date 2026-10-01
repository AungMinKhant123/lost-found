import api from "./axiosClient";

export const createItem = async (formData) => {
  const response = await api.post("/item/createNewPost", formData);

  return response.data;
};

export const getMyPosts = async (params = {}) => {
  const response = await api.get("/item/myposts", {
    params,
  });

  return response.data;
};

export const getMyClaims = async (params = {}) => {
  const response = await api.get("/item/myclaims", {
    params,
  });

  return response.data;
};

export const getItemById = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const createClaim = async ({ itemId, message }) => {
  const response = await api.post("/claims", {
    itemId,
    message,
  });
  return response.data;
};

export const getMyItemClaims = async (itemId) => {
  const response = await api.get(`/items/${itemId}/claims`);

  return response.data;
};

export const getAcceptedClaimContact = async (itemId, claimId) => {
  const response = await api.get(`/items/${itemId}/claims/${claimId}/contact`);

  return response.data.data;
};

export const updateItemClaimStatus = async (itemId, claimId, status) => {
  const response = await api.patch(`/items/${itemId}/claims/${claimId}`, {
    status: status.toUpperCase(),
  });

  return response.data;
};
