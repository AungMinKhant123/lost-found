import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyPost } from "../api/itemsApi";
import { deletePost as deleteMyPostMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function deleteMyPostWithFallback(itemId) {
  try {
    return await deleteMyPost(itemId);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await deleteMyPostMock(itemId);
    }
    throw error;
  }
}

export function useDeleteMyPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyPostWithFallback,

    onSuccess: (_, itemId) => {
      queryClient.removeQueries({
        queryKey: ["item", itemId],
      });

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["my-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["my-claims"] }),
        queryClient.invalidateQueries({ queryKey: ["post-claims", itemId] }),
      ]);
    },
  });
}
