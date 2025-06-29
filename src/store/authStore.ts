import { create } from "zustand";
import { User } from "@/type/user";

// Helper function to clear auth data from localStorage (async)
const clearAuthData = async () => {
  // Use setTimeout to make it non-blocking
  setTimeout(() => {
    try {
      localStorage.removeItem("eazychise_auth_token");
      localStorage.removeItem("eazychise_user_data");
      localStorage.removeItem("eazychise_token_expiry");
    } catch (error) {
      console.warn("Failed to clear auth data from localStorage:", error);
    }
  }, 0);
};

// Helper function to store auth data in localStorage (async)
const storeAuthData = async (userData: User, token: string) => {
  // Use setTimeout to make it non-blocking
  setTimeout(() => {
    try {
      localStorage.setItem("eazychise_auth_token", token);
      localStorage.setItem("eazychise_user_data", JSON.stringify(userData));

      // If token contains expiration info, store it
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp) {
          const expMs = payload.exp * 1000;
          localStorage.setItem(
            "eazychise_token_expiry",
            new Date(expMs).toISOString()
          );
        }
      } catch {
        localStorage.removeItem("eazychise_token_expiry");
      }
    } catch (error) {
      console.warn("Failed to store auth data to localStorage:", error);
    }
  }, 0);
};

// Helper to get token from localStorage
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("eazychise_auth_token");
};

// Helper to get stored user data
export const getStoredUserData = (): User | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("eazychise_user_data");
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

// Store type definition
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  hasChecked: boolean;
  justLoggedOut: boolean; // Flag to track recent logout

  // Actions
  login: (userData: User, token: string) => void;
  logout: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  startLoggingIn: () => void;
  stopLoggingIn: () => void;
  setHasChecked: (checked: boolean) => void;
  clearJustLoggedOut: () => void;
}

// Create the store with hydration from localStorage
const useAuthStore = create<AuthState>((set) => {
  // Initialize state from localStorage if available (immediate hydration)
  let storedUser: User | null = null;
  let hasStoredData = false;

  try {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("eazychise_user_data");
      const token = localStorage.getItem("eazychise_auth_token");

      if (userData && token) {
        storedUser = JSON.parse(userData);
        hasStoredData = true;
      }
    }
  } catch (error) {
    console.warn("Failed to parse stored user data:", error);
    // Clear corrupted data
    if (typeof window !== "undefined") {
      localStorage.removeItem("eazychise_user_data");
      localStorage.removeItem("eazychise_auth_token");
    }
  }

  return {
    // Initial state - optimized for immediate rendering
    user: storedUser,
    isAuthenticated: hasStoredData,
    isLoading: false, // Never start with loading true for better UX
    isLoggingIn: false,
    hasChecked: hasStoredData, // If we have stored data, we've "checked"
    justLoggedOut: false, // Track recent logout

    // Actions - optimized for immediate updates
    login: (userData, token) => {
      // Update state immediately for instant UI response
      set((state) => ({
        ...state,
        user: userData,
        isAuthenticated: true,
        isLoggingIn: false,
        isLoading: false,
        hasChecked: true,
        justLoggedOut: false, // Clear logout flag on login
      }));

      // Store data asynchronously (non-blocking)
      storeAuthData(userData, token);
    },

    logout: () => {
      // Update state immediately for instant UI response
      set((state) => ({
        ...state,
        user: null,
        isAuthenticated: false,
        isLoggingIn: false,
        isLoading: false,
        hasChecked: true,
        justLoggedOut: true, // Set logout flag
      }));

      // Clear data asynchronously (non-blocking)
      clearAuthData();

      // Clear the logout flag after a short delay
      setTimeout(() => {
        set((state) => ({
          ...state,
          justLoggedOut: false,
        }));
      }, 2000); // Clear after 2 seconds
    },

    clearJustLoggedOut: () => set({ justLoggedOut: false }),

    startLoading: () => set({ isLoading: true }),
    stopLoading: () => set({ isLoading: false }),
    startLoggingIn: () => set({ isLoggingIn: true }),
    stopLoggingIn: () => set({ isLoggingIn: false }),
    setHasChecked: (checked) => set({ hasChecked: checked }),
  };
});

// Simple selectors for easy usage throughout the app
const selectors = {
  useStore: useAuthStore,
  useUser: () => useAuthStore((state) => state.user),
  useIsAuthenticated: () => useAuthStore((state) => state.isAuthenticated),
  useIsLoading: () => useAuthStore((state) => state.isLoading),
  useIsLoggingIn: () => useAuthStore((state) => state.isLoggingIn),
  useHasChecked: () => useAuthStore((state) => state.hasChecked),
  useJustLoggedOut: () => useAuthStore((state) => state.justLoggedOut),
  useLogin: () => useAuthStore((state) => state.login),
  useLogout: () => useAuthStore((state) => state.logout),
  useStartLoading: () => useAuthStore((state) => state.startLoading),
  useStopLoading: () => useAuthStore((state) => state.stopLoading),
  useStartLoggingIn: () => useAuthStore((state) => state.startLoggingIn),
  useStopLoggingIn: () => useAuthStore((state) => state.stopLoggingIn),
  useSetHasChecked: () => useAuthStore((state) => state.setHasChecked),
  useClearJustLoggedOut: () =>
    useAuthStore((state) => state.clearJustLoggedOut),
};

// Create a store object with all exports
const authStoreExports = {
  ...selectors,
  store: useAuthStore,
};

// Export the store as default with selectors
export default authStoreExports;
