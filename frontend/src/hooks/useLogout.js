import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { logoutUser } from "../api/authApi";

// One place that fully logs the user out:
//  1. tells the backend (best-effort — if it fails, we still log out here,
//     a network hiccup should never leave someone stuck "logged in"),
//  2. clears the Zustand auth store,
//  3. clears React Query's cache so the NEXT person to log in on this
//     browser can't briefly see the previous user's cached profile.
export function useLogout() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return function performLogout() {
    // Fire the backend call first (the cookie is sent at this moment) and
    // don't wait on it, so a slow/down server never delays logging out.
    logoutUser().catch((error) => {
      console.error(
        "Backend logout call failed (logging out locally anyway):",
        error,
      );
    });

    logout();
    queryClient.clear();
  };
}
