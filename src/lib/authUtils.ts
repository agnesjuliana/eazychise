// src/lib/authUtils.ts
import { toast } from "sonner";
import { User } from "@/type/user";

/**
 * Centralized logout function that handles API cleanup
 * Note: Store updates should be handled by the calling component
 */
export const callLogoutAPI = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/logout", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("Logout API failed");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Logout API error:", error);
    return false;
  }
};

/**
 * Quick login API call
 */
export const callLoginAPI = async (email: string, password: string) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || "Login gagal");
  }
  
  return data;
};

/**
 * Utility to get user redirect path based on role and status
 */
export const getUserRedirectPath = (user: User): string => {
  if (user.role === "ADMIN") {
    return "/admin";
  }
  
  if (user.status === "WAITING") {
    return "/verifikasi";
  }
  
  if (user.role === "FRANCHISOR") {
    return "/franchisor/home";
  }
  
  if (user.role === "FRANCHISEE") {
    return "/franchisee/home";
  }
  
  return "/";
};

/**
 * Show success toast with consistent styling
 */
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 2000,
  });
};

/**
 * Show error toast with consistent styling
 */
export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
  });
};
