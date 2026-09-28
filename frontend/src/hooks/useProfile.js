import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../api/authApi";
import { getMockProfile, updateMockProfile } from "../services/api";

// "Backend unreachable" = no response at all, or a 5xx. A 4xx (e.g. 401,
// 400 validation) means the backend IS working and rejected the request,
// so we never fall back in that case.
function isBackendUnreachable(error) {
  return !error.response || error.response.status >= 500;
}

// TEMPORARY, DEV-ONLY FALLBACK: real backend first, always. Only if it's
// unreachable do we use json-server. Safe to delete once real backend
// integration no longer needs a local fallback (just call getProfile).
async function fetchProfileWithFallback() {
  try {
    return await getProfile();
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getMockProfile();
    }
    throw error;
  }
}

// Same idea for saving the Edit Profile form. The real updateProfile
// call gets the exact same FormData as before.
async function updateProfileWithFallback(formData) {
  try {
    return await updateProfile(formData);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await updateMockProfile(formData);
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
    mutationFn: updateProfileWithFallback,

    // Refetch the profile so the profile page, sidebar and navbar all
    // show the saved values immediately.
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}
