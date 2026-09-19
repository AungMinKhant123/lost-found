import { create } from "zustand";
import { persist } from "zustand/middleware";

// Wrapped in persist() so this store's state survives a full page
// reload — without this, refreshing the page (or typing a URL directly
// into the address bar) wipes React's in-memory state, which made
// ProtectedRoute think nobody was logged in even right after a real
// successful login. persist saves the store to localStorage under the
// key below, and automatically restores it when the app next loads.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // the localStorage key this gets saved under
    },
  ),
);
