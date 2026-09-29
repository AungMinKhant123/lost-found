import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { getItems } from "../api/publicApi";
import { createItem } from "../api/itemsApi";
import {
  getItemsMockPaginated,
  createItemMockFromFormData,
} from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function fetchItemsWithFallback(params) {
  try {
    return await getItems(params);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getItemsMockPaginated(params);
    }
    throw error;
  }
}

async function createItemWithFallback(formData) {
  try {
    return await createItem(formData);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await createItemMockFromFormData(formData);
    }
    throw error;
  }
}

export const useItems = (params) => {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => fetchItemsWithFallback(params),
    placeholderData: keepPreviousData,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItemWithFallback,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["my-items"] });
    },
  });
};
