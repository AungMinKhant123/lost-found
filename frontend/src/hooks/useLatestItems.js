import { useQuery } from "@tanstack/react-query";

import { getLatestItems } from "../api/publicApi";

export function useLatestItems() {
  return useQuery({
    queryKey: ["latest-items"],
    queryFn: getLatestItems,
  });
}
