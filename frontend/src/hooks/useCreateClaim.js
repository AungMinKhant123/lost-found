import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClaim } from "../api/itemsApi";

export function useCreateClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-claims"] });
    },
  });
}
