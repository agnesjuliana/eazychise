"use client";

import { ReactNode, useState } from "react";
import BottomNavbar from "./bottom-navbar";
import { DollarSign, Calendar, Shield, User as UserIcon } from "lucide-react";
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
import { toast } from "sonner";

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API endpoint
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      const data = await response.json();

      if (data.success) {
        // Also clear client-side cookies as backup
        document.cookie =
          "session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie =
          "user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

        // Show success toast
        toast.success("Admin logout berhasil");

        // Close dialog
        setLogoutDialogOpen(false);

        // Redirect to login page
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        throw new Error(data.error || "Logout failed");
      }
    } catch (error) {
      toast.error("Gagal logout");
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
                href: "/admin",
                label: "Manage Users",
                icon: Shield,
              },

              {
                href: "/admin/fund-req",
                label: "Fund Requests",
                icon: DollarSign,
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
