import { useQuery } from "@tanstack/react-query";
import { getItemById } from "../api/itemsApi";

export function useItem(id) {
  return useQuery({
    queryKey: ["item", id],
    queryFn: () => getItemById(id),
    enabled: Boolean(id),
  });
}
