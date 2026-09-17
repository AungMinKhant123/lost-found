import axiosClient from "./axiosClient";

export async function getLatestItems() {
  const response = await axiosClient.get("/public/latest-items");

  return response.data.data;
}
