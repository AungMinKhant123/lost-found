import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClaim } from "../api/itemsApi";
import { createClaimMockFromBackendShape } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function createClaimWithFallback(payload) {
  try {
    return await createClaim(payload);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await createClaimMockFromBackendShape(payload);
    }
    throw error;
  }
}

export function useCreateClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClaimWithFallback,
    onSuccess: (_, { itemId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-claims"] }),
        queryClient.invalidateQueries({ queryKey: ["post-claims", itemId] }),
        queryClient.invalidateQueries({ queryKey: ["item", itemId] }),
        queryClient.invalidateQueries({ queryKey: ["my-posts"] }),
      ]),
  });
}
