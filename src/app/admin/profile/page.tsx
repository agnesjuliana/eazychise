"use client";

import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, LogOut, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminLayout from "@/components/admin-layout";
import withAuth from "@/lib/withAuth";
import {
  callLogoutAPI,
  showSuccessToast,
  showErrorToast,
} from "@/lib/authUtils";
import useAuthStore from "@/store/authStore";

function ProfilePage() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "Loading...",
    role: "Loading...",
    email: "",
    status: "",
  });
  const router = useRouter();

  // Get logout action from auth store
  const { useLogout } = useAuthStore;
  const logout = useLogout();

  React.useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (data.success) {
          setUserData({
            name: data.data.name,
            role: data.data.role,
            email: data.data.email,
            status: data.data.status,
          });
        } else {
          throw new Error(data.error || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Gagal mengambil data profil");
        // Redirect to login if session is invalid
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Update store immediately for instant UI feedback
      logout();

      // Show success toast immediately
      showSuccessToast("Berhasil logout");

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

  const handleMenuClick = (href: string) => {
    if (href === "/logout") {
      setLogoutDialogOpen(true);
    } else {
      router.push(href);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: "Akun",
      href: "/admin/profile/account",
    },

    {
      icon: LogOut,
      label: "Keluar",
      href: "/logout",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <HeaderPage title="PROFILE" />

        {/* Profile Content */}
        <div className="px-4 -mt-6 relative z-10 flex flex-col items-center gap-4 w-full">
          {/* Profile Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm w-full">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                {/* Profile Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src="/image/auth/login.png"
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {loading ? "Loading..." : userData.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">
                      {loading
                        ? "Loading..."
                        : userData.role === "franchisee"
                        ? "Franchisee"
                        : userData.role === "franchisor"
                        ? "Franchisor"
                        : userData.role === "admin"
                        ? "Admin"
                        : userData.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Menu Items */}
          <div className="space-y-2 w-full">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full bg-white rounded-lg h-12 justify-between px-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleMenuClick(item.href)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Button>
              );
            })}
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Konfirmasi Logout</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin keluar dari akun?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(false)}
                disabled={isLoggingOut}
                className="cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-500 hover:bg-red-600 cursor-pointer"
              >
                {isLoggingOut ? "Logout..." : "Ya, Logout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

export default withAuth(ProfilePage, "ADMIN");
