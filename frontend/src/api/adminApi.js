import api from "./axiosClient";

async function withBackendErrorMessage(request) {
  try {
    return await request;
  } catch (error) {
    const message = error.response?.data?.message;
    if (message) {
      throw new Error(message);
    }
    throw error;
  }
}

export async function getAdminDashboard(period = "ALL_TIME") {
  const response = await api.get("/admin/dashboard", {
    params: { period },
  });

  return response.data.data;
}

export async function getAdminListings(params = {}, { signal } = {}) {
  const response = await withBackendErrorMessage(
    api.get("/admin/manage-listings", { params, signal }),
  );

  return response.data;
}

export async function getAdminListing(itemId) {
  const response = await withBackendErrorMessage(
    api.get(`/admin/manage-listings/${itemId}`),
  );

  return response.data.data;
}

export async function deleteAdminListing(itemId) {
  const response = await withBackendErrorMessage(
    api.delete(`/admin/manage-listings/${itemId}`),
  );

  return response.data;
}

export async function getAdminCategories() {
  const response = await withBackendErrorMessage(api.get("/categories"));
  return response.data;
}

export async function getAdminColors() {
  const response = await withBackendErrorMessage(api.get("/colors"));
  return response.data;
}

export async function createAdminCategory(data) {
  const response = await withBackendErrorMessage(
    api.post("/categories", data),
  );
  return response.data.data;
}

export async function updateAdminCategory(categoryId, data) {
  const response = await withBackendErrorMessage(
    api.put(`/categories/${categoryId}`, data),
  );
  return response.data.data;
}

export async function deleteAdminCategory(categoryId) {
  await withBackendErrorMessage(api.delete(`/categories/${categoryId}`));
  return { reassigned: 0 };
}

export async function createAdminColor({ name, hex }) {
  const response = await withBackendErrorMessage(
    api.post("/colors", { name, hexCode: hex }),
  );
  return response.data.data;
}

export async function updateAdminColor(colorId, { name, hex }) {
  const response = await withBackendErrorMessage(
    api.put(`/colors/${colorId}`, { name, hexCode: hex }),
  );
  return response.data.data;
}

export async function deleteAdminColor(colorId) {
  await withBackendErrorMessage(api.delete(`/colors/${colorId}`));
  return { reassigned: 0 };
}
