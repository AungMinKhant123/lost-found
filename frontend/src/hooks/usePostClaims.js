import { useQuery } from "@tanstack/react-query";
import { getMyItemClaims } from "../api/itemsApi";
import { getMyItemClaimsMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function fetchPostClaims(itemId) {
  try {
    return await getMyItemClaims(itemId);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getMyItemClaimsMock(itemId);
    }
    throw error;
  }
}

export function usePostClaims(itemId) {
  return useQuery({
    queryKey: ["post-claims", itemId],
    queryFn: () => fetchPostClaims(itemId),
    enabled: Boolean(itemId),
  });
}
