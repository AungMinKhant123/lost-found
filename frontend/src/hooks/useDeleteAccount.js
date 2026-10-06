import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "../api/authApi";
import { deleteUserAccount, isRealBackendUserId } from "../services/api";
import { useAuthStore } from "../store/authStore";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function deleteAccountWithFallback(userId) {
  try {
    return await deleteAccount();
  } catch (error) {
    if (
      import.meta.env.DEV &&
      userId &&
      !isRealBackendUserId(userId) &&
      isBackendUnreachable(error)
    ) {
      return await deleteUserAccount(userId);
    }
    throw error;
  }
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: deleteAccountWithFallback,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}
