"use client";

import { Role, Status } from "@/type/user";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { User } from "@/type/user";

/**
 * Acceptable roles:
 * - "FRANCHISEE" for franchisee route access
 * - "FRANCHISOR" for franchisor route access
 * - "ADMIN" for admin routes
 * - "ANY" means user must be authenticated but any role
 * - "GUEST" means user must be UNauthenticated (for login/register pages)
 * - "OPTIONAL" means no auth required, but if user is logged in we pass user info
 * - "VERIFICATION" for verification page only
 */
type RouteRole =
  | "FRANCHISEE"
  | "FRANCHISOR"
  | "ADMIN"
  | "ANY"
  | "GUEST"
  | "OPTIONAL"
  | "VERIFICATION";

/**
 * Path checks based on role
 */
function isFranchiseePath(path: string): boolean {
  return path.startsWith("/franchisee");
}

function isFranchisorPath(path: string): boolean {
  return path.startsWith("/franchisor");
}

function isAdminPath(path: string): boolean {
  return path.startsWith("/admin");
}

function isPublicPath(path: string): boolean {
  return (
    path === "/" ||
    path === "/home" ||
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/start")
  );
}

function isVerificationPath(path: string): boolean {
  return path.startsWith("/verifikasi");
}

/**
 * Higher Order Component for route protection
 * @param WrappedComponent The component to wrap with authentication
 * @param routeRole The role required to access the route
 */
export default function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T & { user?: User | null }>,
  routeRole: RouteRole = "ANY"
) {
  const ComponentWithAuth = (props: T) => {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    // Use Zustand store selectors
    const { useUser, useIsAuthenticated, useHasChecked, useJustLoggedOut } =
      useAuthStore;
    const user = useUser();
    const isAuthenticated = useIsAuthenticated();
    const hasChecked = useHasChecked();
    const justLoggedOut = useJustLoggedOut();

    // Use Zustand store actions
    const { useLogin, useLogout, useSetHasChecked } = useAuthStore;
    const login = useLogin();
    const logout = useLogout();
    const setHasChecked = useSetHasChecked();

    const isCheckingRef = useRef(false);
    const hasShownToastRef = useRef(false);
    const lastToastTimeRef = useRef(0);
    const isRedirectingRef = useRef(false);

    // Set mounted state to prevent hydration mismatch
    useEffect(() => {
      setMounted(true);
    }, []);

    // Helper function to show toast with debouncing
    const showToastOnce = useCallback(
      (message: string, type: "info" | "error" = "info", debounceMs = 1000) => {
        const now = Date.now();
        if (now - lastToastTimeRef.current < debounceMs) {
          return;
        }

        lastToastTimeRef.current = now;
        if (type === "error") {
          toast.error(message);
        } else {
          toast.info(message);
        }
      },
      []
    );

    // Helper function to redirect only once
    const redirectOnce = useCallback(
      (path: string) => {
        if (isRedirectingRef.current) return;
        isRedirectingRef.current = true;
        router.replace(path);
      },
      [router]
    );

    // Fetch user data with aggressive optimizations
    const fetchUserData = useCallback(async () => {
      if (isCheckingRef.current) return;

      isCheckingRef.current = true;

      try {
        const res = await fetch("/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout();
            // Immediate redirect for unauthenticated users on protected routes
            if (
              !isPublicPath(pathname) &&
              routeRole !== "GUEST" &&
              routeRole !== "OPTIONAL"
            ) {
              router.replace("/login");
            }
          } else {
            logout();
          }
        } else {
          const data = await res.json();
          if (data?.data) {
            // Optimistic update - update state immediately
            login(data.data, data.token || "");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        logout();
      } finally {
        setHasChecked(true);
        isCheckingRef.current = false;
      }
    }, [pathname, login, logout, setHasChecked, router]);

    // Simplified useEffect - fetch user data once only
    useEffect(() => {
      if (!hasChecked && !isCheckingRef.current) {
        fetchUserData();
      }
    }, [fetchUserData, hasChecked]);

    // Reset flags when pathname changes - no redirection logic here
    useEffect(() => {
      hasShownToastRef.current = false;
      lastToastTimeRef.current = 0;
      isRedirectingRef.current = false;
    }, [pathname]);

    // Minimal event listeners - only essential ones
    useEffect(() => {
      let focusTimeout: NodeJS.Timeout;

      const handleFocus = () => {
        // Only recheck on focus if we're on a protected route and it's been a while
        if (
          hasChecked &&
          !isCheckingRef.current &&
          !isRedirectingRef.current &&
          !isPublicPath(pathname)
        ) {
          clearTimeout(focusTimeout);
          focusTimeout = setTimeout(() => {
            if (!isRedirectingRef.current && !isCheckingRef.current) {
              fetchUserData();
            }
          }, 3000); // Even longer debounce to reduce API calls
        }
      };

      // Only add focus listener for authenticated users on protected routes
      if (isAuthenticated && !isPublicPath(pathname)) {
        window.addEventListener("focus", handleFocus);
      }

      return () => {
        window.removeEventListener("focus", handleFocus);
        clearTimeout(focusTimeout);
      };
    }, [fetchUserData, hasChecked, pathname, isAuthenticated]);

    // Streamlined rendering logic - prioritize immediate rendering

    // Skip loading entirely - render components immediately with cached data
    // Only show loading on very first visit when no data exists at all
    if (!hasChecked && !user && !isAuthenticated) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#EF5A5A]" />
        </div>
      );
    }

    // Prevent hydration mismatch by ensuring consistent rendering on server and client
    if (!mounted) {
      // Always render a consistent loading state that matches what the client will show initially
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#EF5A5A]" />
        </div>
      );
    }

    // For authenticated users, render immediately without waiting
    if (isAuthenticated && user) {
      // Handle role-based redirects without showing loading
      if (user.status === Status.WAITING && !isVerificationPath(pathname)) {
        if (!isRedirectingRef.current) {
          showToastOnce("Akun anda sedang menunggu verifikasi", "info");
          redirectOnce("/verifikasi");
        }
        // Render the component immediately, redirect will happen in background
        return <WrappedComponent {...props} user={user} />;
      }

      if (user.status === Status.ACCEPTED && isVerificationPath(pathname)) {
        if (!isRedirectingRef.current) {
          switch (user.role) {
            case Role.FRANCHISEE:
              redirectOnce("/franchisee/home");
              break;
            case Role.FRANCHISOR:
              redirectOnce("/franchisor/home");
              break;
            case Role.ADMIN:
              redirectOnce("/admin");
              break;
          }
        }
        // Render immediately while redirect happens
        return <WrappedComponent {...props} user={user} />;
      }

      // Role-based path restrictions
      if (user.status === Status.ACCEPTED) {
        if (
          (isFranchiseePath(pathname) && user.role !== Role.FRANCHISEE) ||
          (isFranchisorPath(pathname) && user.role !== Role.FRANCHISOR) ||
          (isAdminPath(pathname) && user.role !== Role.ADMIN)
        ) {
          if (!isRedirectingRef.current) {
            showToastOnce("Anda tidak memiliki akses ke halaman ini", "error");
            switch (user.role) {
              case Role.FRANCHISEE:
                redirectOnce("/franchisee/home");
                break;
              case Role.FRANCHISOR:
                redirectOnce("/franchisor/home");
                break;
              case Role.ADMIN:
                redirectOnce("/admin");
                break;
            }
          }
          // Show current page briefly while redirecting
          return <WrappedComponent {...props} user={user} />;
        }
      }

      // Role-specific route validation for authenticated users
      if (!isPublicPath(pathname)) {
        if (
          (routeRole === "FRANCHISEE" && user.role !== Role.FRANCHISEE) ||
          (routeRole === "FRANCHISOR" && user.role !== Role.FRANCHISOR) ||
          (routeRole === "ADMIN" && user.role !== Role.ADMIN)
        ) {
          if (!isRedirectingRef.current) {
            showToastOnce("Anda tidak memiliki akses ke halaman ini", "error");
            switch (user.role) {
              case Role.FRANCHISEE:
                redirectOnce("/franchisee/home");
                break;
              case Role.FRANCHISOR:
                redirectOnce("/franchisor/home");
                break;
              case Role.ADMIN:
                redirectOnce("/admin");
                break;
            }
          }
          return <WrappedComponent {...props} user={user} />;
        }
      }

      // Guest routes: redirect authenticated users quickly
      if (routeRole === "GUEST") {
        if (!isRedirectingRef.current) {
          switch (user.role) {
            case Role.FRANCHISEE:
              redirectOnce("/franchisee/home");
              break;
            case Role.FRANCHISOR:
              redirectOnce("/franchisor/home");
              break;
            case Role.ADMIN:
              redirectOnce("/admin");
              break;
          }
        }
        // Show current page briefly while redirecting
        return <WrappedComponent {...props} user={user} />;
      }

      // All checks passed - render component immediately
      return <WrappedComponent {...props} user={user} />;
    }

    // Handle unauthenticated users
    if (hasChecked && !isAuthenticated) {
      // For public paths or optional auth, render immediately
      if (
        isPublicPath(pathname) ||
        routeRole === "GUEST" ||
        routeRole === "OPTIONAL"
      ) {
        return <WrappedComponent {...props} user={null} />;
      }

      // For protected routes, show toast and redirect immediately
      if (
        ["ANY", "FRANCHISEE", "FRANCHISOR", "ADMIN", "VERIFICATION"].includes(
          routeRole
        )
      ) {
        if (
          !hasShownToastRef.current &&
          !isRedirectingRef.current &&
          !justLoggedOut
        ) {
          showToastOnce("Anda harus login terlebih dahulu", "info");
          hasShownToastRef.current = true;
          redirectOnce("/login");
        } else if (justLoggedOut && !isRedirectingRef.current) {
          // If user just logged out, redirect without showing toast
          redirectOnce("/login");
        }
        // Show minimal loading during redirect
        return (
          <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#EF5A5A]" />
          </div>
        );
      }
    }

    // If all checks pass, render the component
    return <WrappedComponent {...props} user={user} />;
  };

  return ComponentWithAuth;
}
