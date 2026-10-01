import { useQuery } from "@tanstack/react-query";
import { getLatestItems } from "../api/publicApi";
import { getLatestItemsMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function fetchLatestItemsWithFallback() {
  try {
    return await getLatestItems();
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getLatestItemsMock(6);
    }
    throw error;
  }
}

export function useLatestItems() {
  return useQuery({
    queryKey: ["latest-items"],
    queryFn: fetchLatestItemsWithFallback,
  });
}
