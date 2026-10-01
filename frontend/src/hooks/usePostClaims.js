import { useQuery } from "@tanstack/react-query";
import { getMyItemClaims } from "../services/api";

export function usePostClaims(itemId) {
  return useQuery({
    queryKey: ["post-claims", itemId],
    queryFn: () => getMyItemClaims(itemId),
    enabled: Boolean(itemId),
  });
}
