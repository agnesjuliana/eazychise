"use client";

import { ReactNode } from "react";
import BottomNavbar from "./bottom-navbar";
import { Bell, Building2, Calendar, Home, User } from "lucide-react";

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
    <div
      className={`min-h-screen bg-background flex justify-center ${className}`}
    >
      <div className="w-full max-w-md relative">
        {/* Main content area */}
        <main className={`${showBottomNav ? "pb-16" : ""}`}>{children}</main>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNavbar
            navItems={[
              {
                href: "/franchisee/home",
                label: "Home",
                icon: Home,
              },
              {
                href: "/franchisee/event",
                label: "Event",
                icon: Calendar,
              },
              {
                href: "/franchisee/franchise",
                label: "Franchise",
                icon: Building2,
              },
              {
                href: "/franchisee/notification",
                label: "Notification",
                icon: Bell,
              },
              {
                href: "/franchisee/profile",
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
