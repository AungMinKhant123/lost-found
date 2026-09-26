import { useQuery } from "@tanstack/react-query";
import { getLatestItems } from "../api/publicApi";
import { getLatestItemsMock } from "../services/api";

// TEMPORARY, DEV-ONLY FALLBACK: tries the real /public/latest-items
// endpoint first — nothing changes when it's working. Only if it's
// genuinely unreachable (no response, or a 5xx server error) does this
// fall back to json-server's mock items instead. Safe to delete this
// whole function (just call getLatestItems directly) once real backend
// integration no longer needs a local fallback.
async function fetchLatestItemsWithFallback() {
  try {
    return await getLatestItems();
  } catch (error) {
    const isBackendUnreachable =
      !error.response || error.response.status >= 500;

    if (import.meta.env.DEV && isBackendUnreachable) {
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
