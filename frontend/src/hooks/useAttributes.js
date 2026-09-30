import { useQuery } from "@tanstack/react-query";
import { getCategories, getColors } from "../api/publicApi";
import {
  getCategories as getMockCategories,
  getColours as getMockColours,
} from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

// TEMPORARY, DEV-ONLY FALLBACK: the real backend call runs first, every
// time — nothing changes when it's working. Only falls back to
// json-server's mock categories/colours when the real endpoint is
// unreachable, reshaped to match the real API's field names (our mock
// colours use "hex", the real API uses "hexCode"), so every page using
// this hook (New Post, Item List, Manage Listings) behaves the same
// either way. Safe to delete these two functions (call getCategories/
// getColors directly) once real backend integration no longer needs a
// local fallback.
async function fetchCategoriesWithFallback() {
  try {
    return await getCategories();
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      const mock = await getMockCategories();
      return mock.map((c) => ({ id: c.id, name: c.name, icon: c.icon }));
    }
    throw error;
  }
}

async function fetchColorsWithFallback() {
  try {
    return await getColors();
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      const mock = await getMockColours();
      return mock.map((c) => ({ id: c.id, name: c.name, hexCode: c.hex }));
    }
    throw error;
  }
}

export function useAttributes() {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesWithFallback,
  });

  const colorsQuery = useQuery({
    queryKey: ["colors"],
    queryFn: fetchColorsWithFallback,
  });

  return {
    categories: categoriesQuery.data ?? [],
    colors: colorsQuery.data ?? [],
    loading: categoriesQuery.isLoading || colorsQuery.isLoading,
    error: categoriesQuery.error || colorsQuery.error,
  };
}
