import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../api/authApi";
import { getCurrentUser } from "../services/api";

// TEMPORARY, DEV-ONLY FALLBACK: tries the real backend's /auth/profile
// first — nothing changes when it's working. Only if it's genuinely
// unreachable (no response, or a 5xx server error) does this fall back
// to json-server's mock user data instead. Safe to delete this whole
// function (just call getProfile directly) once real backend
// integration no longer needs a local fallback.
async function fetchProfileWithFallback() {
  try {
    return await getProfile();
  } catch (error) {
    const isBackendUnreachable =
      !error.response || error.response.status >= 500;

    if (import.meta.env.DEV && isBackendUnreachable) {
      return await getCurrentUser();
    }

    throw error;
  }
}

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfileWithFallback,
  });
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}
