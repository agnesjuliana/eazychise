"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  FileText,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
      href: "/franchisor/profile/account",
    },
    {
      icon: FileText,
      label: "Kelengkapan dokumen",
      href: "/franchisor/profile/documents",
    },
    {
      icon: HelpCircle,
      label: "Bantuan",
      href: "/franchisor/profile/help",
    },
    {
      icon: Shield,
      label: "Kebijakan privasi",
      href: "/franchisor/profile/privacy",
    },
    {
      icon: LogOut,
      label: "Keluar",
      href: "/logout",
    },
  ];

  return (
    <FranchisorLayout className="overflow-x-hidden">
      <div className="min-h-screen bg-gray-50">
        {/* Custom Header dengan Back Button Integrated */}
        <div className="bg-[#EF5A5A] h-[162px] w-full relative rounded-b-[10px] flex items-center justify-center">
          {/* Back Button di dalam header */}
          <div className="absolute left-4 top-4">
            <BackButton fallbackUrl="/franchisor/home" variant="ghost" size="sm" className="text-white hover:bg-white/20 border-white/30" />
          </div>
          
          {/* Cloud decorations */}
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute -top-[20px] left-[80px]"
          />
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute bottom-[45px] left-[0px]"
          />
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute top-[20px] -right-[40px]"
          />
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute bottom-[10px] right-[40px]"
          />
          
          {/* Title */}
          <h2 className="text-center text-white text-[24px] font-semibold font-poppins mt-4">
            PROFILE
          </h2>
        </div>

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
                    {!loading && userData.status && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          userData.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : userData.status === "WAITING"
                            ? "bg-yellow-100 text-yellow-800"
                            : userData.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {userData.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Menu Items */}
          <div className="space-y-2">
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
    </FranchisorLayout>
  );
}
export default withAuth(ProfilePage, "FRANCHISOR");
