import { useQuery } from "@tanstack/react-query";
import { getMyClaims } from "../api/itemsApi";
import { getMyClaimsMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function fetchMyClaimsWithFallback(params) {
  try {
    return await getMyClaims(params);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getMyClaimsMock(params);
    }
    throw error;
  }
}

export function useMyClaims(params = {}) {
  return useQuery({
    queryKey: ["my-claims", params],
    queryFn: () => fetchMyClaimsWithFallback(params),
  });
}
