import { create } from "zustand";
import { User } from "@/type/user";

// Helper function to clear auth data from localStorage
const clearAuthData = () => {
  localStorage.removeItem("eazychise_auth_token");
  localStorage.removeItem("eazychise_user_data");
  localStorage.removeItem("eazychise_token_expiry");
};

// Helper function to store auth data in localStorage
const storeAuthData = (userData: User, token: string) => {
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
    // If token parsing fails, don't store expiry
    localStorage.removeItem("eazychise_token_expiry");
  }
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

  // Actions
  login: (userData: User, token: string) => void;
  logout: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  startLoggingIn: () => void;
  stopLoggingIn: () => void;
  setHasChecked: (checked: boolean) => void;
}

// Create the store with hydration from localStorage
const useAuthStore = create<AuthState>((set) => {
  // Initialize state from localStorage if available
  const storedUser = getStoredUserData();

  return {
    // Initial state
    user: storedUser,
    isAuthenticated: !!storedUser,
    isLoading: !storedUser, // If we have user data, we're not loading
    isLoggingIn: false,
    hasChecked: !!storedUser, // If we have user data, we've already checked

    // Actions
    login: (userData, token) => {
      storeAuthData(userData, token);
      set({
        user: userData,
        isAuthenticated: true,
        isLoggingIn: false,
        isLoading: false,
        hasChecked: true, // Set hasChecked to true when login happens
      });
    },

    logout: () => {
      clearAuthData();
      set({
        user: null,
        isAuthenticated: false,
        isLoggingIn: false,
        hasChecked: true,
      });
    },

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
  useLogin: () => useAuthStore((state) => state.login),
  useLogout: () => useAuthStore((state) => state.logout),
  useStartLoading: () => useAuthStore((state) => state.startLoading),
  useStopLoading: () => useAuthStore((state) => state.stopLoading),
  useStartLoggingIn: () => useAuthStore((state) => state.startLoggingIn),
  useStopLoggingIn: () => useAuthStore((state) => state.stopLoggingIn),
  useSetHasChecked: () => useAuthStore((state) => state.setHasChecked),
};

// Create a store object with all exports
const authStoreExports = {
  ...selectors,
  store: useAuthStore,
};

// Export the store as default with selectors
export default authStoreExports;
