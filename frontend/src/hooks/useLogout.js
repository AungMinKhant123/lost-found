import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { logout } from "../api/authApi"; // Kept your original api import

export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuthStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logout,
    // This executes automatically as soon as the logout button is clicked
    onMutate: async () => {
      // 1. Clear local Zustand store immediately
      clearAuthStore();

      // 2. Clear React Query cache so no data leaks to the next user
      queryClient.clear();
    },
    onError: (error) => {
      console.error(
        "Backend logout call failed (logged out locally anyway):",
        error,
      );
    },
  });
}
