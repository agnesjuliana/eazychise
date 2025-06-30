"use client";

import { ReactNode, useState } from "react";
import BottomNavbar from "./bottom-navbar";
import { Shield, User as UserIcon, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  callLogoutAPI,
  showSuccessToast,
  showErrorToast,
} from "@/lib/authUtils";
import useAuthStore from "@/store/authStore";

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
  showBottomNav?: boolean;
}

export default function AdminLayout({
  children,
  className = "",
  showBottomNav = true,
}: AdminLayoutProps) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Get logout action from auth store
  const { useLogout } = useAuthStore;
  const logout = useLogout();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Update store immediately for instant UI feedback
      logout();

      // Show success toast immediately
      showSuccessToast("Admin logout berhasil");

      // Close dialog
      setLogoutDialogOpen(false);

      // Call logout API in background (non-blocking)
      callLogoutAPI().catch(console.warn);

      // Redirect immediately without delay
      router.replace("/login");
    } catch (error) {
      showErrorToast("Gagal logout");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavClick = (href: string) => {
    if (href === "/admin/logout") {
      setLogoutDialogOpen(true);
    } else {
      router.push(href);
    }
  };
  return (
    <div className={`min-h-screen bg-gray-50 flex justify-center ${className}`}>
      <div className="w-full max-w-md relative">
        {/* Main content area */}
        <main className={`${showBottomNav ? "pb-16" : ""}`}>{children}</main>

        {/* Bottom Navigation for Admin */}
        {showBottomNav && (
          <BottomNavbar
            navItems={[
              {
                href: "/admin/admin-panel",
                label: "Admin Panel",
                icon: Shield,
              },
              {
                href: "/admin/event",
                label: "Event",
                icon: Calendar,
              },
              {
                href: "/admin/profile",
                label: "Profile",
                icon: UserIcon,
              },
            ]}
            onNavClick={handleNavClick}
          />
        )}

        {/* Logout Confirmation Dialog */}
        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Logout Admin</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin keluar dari panel admin?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(false)}
                disabled={isLoggingOut}
              >
                Batal
              </Button>
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoggingOut ? "Logout..." : "Ya, Logout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
