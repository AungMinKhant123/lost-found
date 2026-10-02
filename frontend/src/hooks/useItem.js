import { useQuery } from "@tanstack/react-query";
import { getItemById } from "../api/itemsApi";
import { getItemByIdMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function fetchItemWithFallback(id) {
  try {
    return await getItemById(id);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getItemByIdMock(id);
    }
    throw error;
  }
}

export function useItem(id) {
  return useQuery({
    queryKey: ["item", id],
    queryFn: () => fetchItemWithFallback(id),
    enabled: Boolean(id),
  });
}
