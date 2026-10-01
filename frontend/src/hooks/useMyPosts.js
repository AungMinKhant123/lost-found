import { useQuery } from "@tanstack/react-query";
import { getMyPosts } from "../api/itemsApi";

export function useMyPosts(params = {}) {
  return useQuery({
    queryKey: ["my-posts", params],
    queryFn: () => getMyPosts(params),
  });
}
