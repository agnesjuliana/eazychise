"use client";

import { Role, Status } from "@/type/user";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useCallback, useRef } from "react";
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

    // Use Zustand store selectors
    const { useUser, useIsLoading, useIsAuthenticated, useHasChecked } =
      useAuthStore;
    const user = useUser();
    const isLoading = useIsLoading();
    const isAuthenticated = useIsAuthenticated();
    const hasChecked = useHasChecked();

    // Use Zustand store actions
    const {
      useLogin,
      useLogout,
      useStartLoading,
      useStopLoading,
      useSetHasChecked,
    } = useAuthStore;
    const login = useLogin();
    const logout = useLogout();
    const startLoading = useStartLoading();
    const stopLoading = useStopLoading();
    const setHasChecked = useSetHasChecked();

    const isCheckingRef = useRef(false);

    // Fetch user data
    const fetchUserData = useCallback(async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;
      startLoading();

      try {
        console.log("withAuth: Checking session on path:", pathname);
        const res = await fetch("/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        console.log("withAuth: Response status:", res);

        if (!res.ok) {
          if (res.status === 401) {
            // Not authenticated
            logout();

            // Only redirect if not on a public path or trying to access a protected route
            if (
              !isPublicPath(pathname) &&
              routeRole !== "GUEST" &&
              routeRole !== "OPTIONAL"
            ) {
              router.replace("/login");
            }
          } else {
            throw new Error("Failed to fetch user data");
          }
        } else {
          const data = await res.json();
          console.log("withAuth: User data fetched:", data);
          if (data?.data) {
            // Extract necessary data from response
            const userData = data.data;

            // Look for token in response or headers
            const token = data.token || ""; // If you have token in the response

            // Login with user data from response
            login(userData, token);
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        stopLoading();
        setHasChecked(true);
        isCheckingRef.current = false;
      }
    }, [
      pathname,
      router,
      login,
      logout,
      startLoading,
      stopLoading,
      setHasChecked,
    ]); // Check if the user should be redirected based on their status and the path
    const checkRedirection = useCallback(() => {
      if (!user || isLoading) return;

      // Users with WAITING status should only access verification page
      if (user.status === Status.WAITING && !isVerificationPath(pathname)) {
        toast.info("Akun anda sedang menunggu verifikasi");
        router.replace("/verifikasi");
        return;
      }

      // Users with ACCEPTED status shouldn't access verification page
      if (user.status === Status.ACCEPTED && isVerificationPath(pathname)) {
        switch (user.role) {
          case Role.FRANCHISEE:
            router.replace("/franchisee/home");
            break;
          case Role.FRANCHISOR:
            router.replace("/franchisor/home");
            break;
          case Role.ADMIN:
            router.replace("/admin");
            break;
        }
        return;
      }

      // Role-based path restrictions
      if (user.status === Status.ACCEPTED) {
        // Check if user is trying to access a path they don't have permission for
        if (
          (isFranchiseePath(pathname) && user.role !== Role.FRANCHISEE) ||
          (isFranchisorPath(pathname) && user.role !== Role.FRANCHISOR) ||
          (isAdminPath(pathname) && user.role !== Role.ADMIN)
        ) {
          toast.error("Anda tidak memiliki akses ke halaman ini");
          switch (user.role) {
            case Role.FRANCHISEE:
              router.replace("/franchisee/home");
              break;
            case Role.FRANCHISOR:
              router.replace("/franchisor/home");
              break;
            case Role.ADMIN:
              router.replace("/admin");
              break;
          }
          return;
        }
      }
    }, [user, isLoading, pathname, router]);

    // Fetch user data on component mount and pathname change
    useEffect(() => {
      fetchUserData();
    }, [fetchUserData]);

    // Check redirection when user data or pathname changes
    useEffect(() => {
      checkRedirection();
    }, [checkRedirection]); // Add event listeners to detect auth changes (tab focus, local storage changes)
    useEffect(() => {
      let debounceTimeout: NodeJS.Timeout;

      const handleFocus = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(fetchUserData, 300);
      };

      const handleStorage = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(fetchUserData, 300);
      };

      window.addEventListener("focus", handleFocus);
      window.addEventListener("storage", handleStorage);

      return () => {
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("storage", handleStorage);
        clearTimeout(debounceTimeout);
      };
    }, [fetchUserData]);

    // Handle loading state
    if (isLoading && !hasChecked) {
      return (
        <div className="flex min-h-screen items-center justify-center max-w-md">
          <Loader2 className="h-10 w-10 animate-spin text-[#EF5A5A]" />
        </div>
      );
    } // Guest routes should only be accessible to unauthenticated users
    if (routeRole === "GUEST" && isAuthenticated) {
      switch (user?.role) {
        case Role.FRANCHISEE:
          router.replace("/franchisee/home");
          break;
        case Role.FRANCHISOR:
          router.replace("/franchisor/home");
          break;
        case Role.ADMIN:
          router.replace("/admin");
          break;
      }
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#EF5A5A]" />
        </div>
      );
    }

    // Verification route should only be accessible to users with WAITING status
    if (routeRole === "VERIFICATION" && user?.status !== Status.WAITING) {
      switch (user?.role) {
        case Role.FRANCHISEE:
          router.replace("/franchisee/home");
          break;
        case Role.FRANCHISOR:
          router.replace("/franchisor/home");
          break;
        case Role.ADMIN:
          router.replace("/admin");
          break;
        default:
          router.replace("/login");
          break;
      }
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#EF5A5A]" />
        </div>
      );
    }

    // Role-specific route validation
    if (!isPublicPath(pathname) && isAuthenticated) {
      if (
        (routeRole === "FRANCHISEE" && user?.role !== Role.FRANCHISEE) ||
        (routeRole === "FRANCHISOR" && user?.role !== Role.FRANCHISOR) ||
        (routeRole === "ADMIN" && user?.role !== Role.ADMIN)
      ) {
        toast.error("Anda tidak memiliki akses ke halaman ini");
        switch (user?.role) {
          case Role.FRANCHISEE:
            router.replace("/franchisee/home");
            break;
          case Role.FRANCHISOR:
            router.replace("/franchisor/home");
            break;
          case Role.ADMIN:
            router.replace("/admin");
            break;
        }
        return (
          <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#EF5A5A]" />
          </div>
        );
      }
    }

    // At top of render
    if (!hasChecked) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#EF5A5A]" />
        </div>
      );
    }

    // Now perform login-required guard *only* after hasChecked
    if (
      ["ANY", "FRANCHISEE", "FRANCHISOR", "ADMIN", "VERIFICATION"].includes(
        routeRole
      ) &&
      !isAuthenticated &&
      !isPublicPath(pathname)
    ) {
      toast.info("Anda harus login terlebih dahulu");
      return <Loader2 className="h-10 w-10 animate-spin text-[#EF5A5A]" />;
    }

    // If all checks pass, render the component
    return <WrappedComponent {...props} user={user} />;
  };

  return ComponentWithAuth;
}
