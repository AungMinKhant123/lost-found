import { useQuery } from "@tanstack/react-query";
import { getMyClaims } from "../api/itemsApi";

export function useMyClaims(params = {}) {
  return useQuery({
    queryKey: ["my-claims", params],
    queryFn: () => getMyClaims(params),
  });
}
