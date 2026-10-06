import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelMyClaim } from "../api/itemsApi";
import { cancelClaim as cancelMyClaimMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function cancelMyClaimWithFallback(claimId) {
  try {
    return await cancelMyClaim(claimId);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await cancelMyClaimMock(claimId);
    }
    throw error;
  }
}

export function useCancelMyClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMyClaimWithFallback,
    onSuccess: (_, claimId) =>
      Promise.all([
        queryClient.removeQueries({ queryKey: ["my-claim", claimId] }),
        queryClient.invalidateQueries({ queryKey: ["my-claims"] }),
      ]),
  });
}
