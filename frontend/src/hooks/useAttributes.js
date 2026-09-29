import { useQuery } from "@tanstack/react-query";
import { getCategories, getColors } from "../api/publicApi";

export function useAttributes() {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const colorsQuery = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
  });

  return {
    categories: categoriesQuery.data ?? [],
    colors: colorsQuery.data ?? [],

    loading: categoriesQuery.isLoading || colorsQuery.isLoading,

    error: categoriesQuery.error || colorsQuery.error,
  };
}
