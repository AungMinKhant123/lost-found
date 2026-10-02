import { useQuery } from "@tanstack/react-query";
import { getMyPosts } from "../api/itemsApi";
import { getMyPostsMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function fetchMyPostsWithFallback(params) {
  try {
    return await getMyPosts(params);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getMyPostsMock();
    }
    throw error;
  }
}

export function useMyPosts(params = {}) {
  return useQuery({
    queryKey: ["my-posts", params],
    queryFn: () => fetchMyPostsWithFallback(params),
  });
}
