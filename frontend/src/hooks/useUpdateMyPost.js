import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyPost } from "../api/itemsApi";
import { updatePost as updateMyPostMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function updateMyPostWithFallback({ itemId, updates, mockUpdates }) {
  try {
    return await updateMyPost(itemId, updates);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await updateMyPostMock(itemId, mockUpdates);
    }
    throw error;
  }
}

export function useUpdateMyPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyPostWithFallback,
    onSuccess: (_, { itemId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["my-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["item", itemId] }),
        queryClient.invalidateQueries({ queryKey: ["post-claims", itemId] }),
      ]),
  });
}
