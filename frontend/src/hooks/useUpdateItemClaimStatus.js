import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItemClaimStatus } from "../api/itemsApi";
import { updateItemClaimStatusMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function updateClaimWithFallback({ itemId, claimId, status }) {
  try {
    return await updateItemClaimStatus(itemId, claimId, status);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await updateItemClaimStatusMock(itemId, claimId, status);
    }
    throw error;
  }
}

export function useUpdateItemClaimStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClaimWithFallback,
    onSuccess: (_, { itemId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["post-claims", itemId] }),
        queryClient.invalidateQueries({ queryKey: ["my-claims"] }),
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["my-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["my-claim"] }),
      ]),
  });
}
