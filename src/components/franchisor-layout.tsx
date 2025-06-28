"use client";

import { ReactNode } from "react";
import BottomNavbar from "./bottom-navbar";
import { Bell, FileText, GraduationCap, Home, User } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  showBottomNav?: boolean;
}

export default function AppLayout({
  children,
  className = "",
  showBottomNav = true,
}: AppLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 flex justify-center ${className}`}>
      <div className="w-full max-w-md relative">
        {/* Main content area */}
        <main className={`${showBottomNav ? "pb-16" : ""}`}>{children}</main>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNavbar
            navItems={[
              {
                href: "/franchisor/home",
                label: "Home",
                icon: Home,
              },
              {
                href: "/franchisor/applicant",
                label: "Applicant",
                icon: FileText,
              },
              {
                href: "/franchisor/tutorial-add",
                label: "Training",
                icon: GraduationCap,
              },
              {
                href: "/franchisor/notification",
                label: "Notification",
                icon: Bell,
              },
              {
                href: "/franchisor/profile",
                label: "Profile",
                icon: User,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
