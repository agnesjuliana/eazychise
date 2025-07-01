"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type NavbarItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

interface BottomNavbarProps {
  navItems: NavbarItem[];
  className?: string;
  onNavClick?: (href: string) => void;
}

export default function BottomNavbar({
  navItems = [],
  className = "",
  onNavClick,
}: BottomNavbarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not showing active state until mounted
  const getIsActive = (href: string) => {
    if (!mounted) return false;

    // Check for exact match first
    if (pathname === href) return true;

    // Universal base path matching
    // This will work for any nested routes:
    //
    // TEST CASES:
    // ✅ href: "/franchisee/home", pathname: "/franchisee/home" -> true (exact match)
    // ✅ href: "/franchisee/home", pathname: "/franchisee/home/detail" -> true (nested)
    // ✅ href: "/franchisee/event", pathname: "/franchisee/event/123" -> true (nested)
    // ✅ href: "/franchisee/franchise", pathname: "/franchisee/franchise/search" -> true (nested)
    // ✅ href: "/franchisee/notification", pathname: "/franchisee/notification/unread" -> true (nested)
    // ✅ href: "/franchisee/profile", pathname: "/franchisee/profile/account" -> true (nested)
    // ✅ href: "/franchisor/franchise", pathname: "/franchisor/franchise/manage" -> true (nested)
    // ✅ href: "/admin/users", pathname: "/admin/users/edit/123" -> true (nested)
    // ❌ href: "/franchisee/home", pathname: "/franchisee/event" -> false (different base)
    // ❌ href: "/franchisee/profile", pathname: "/franchisor/profile" -> false (different role)
    // ❌ href: "/franchisee/event", pathname: "/franchisee/eventmanager" -> false (not a true nested path)

    // Check if current pathname starts with the href (base path)
    // This handles nested routes automatically
    if (pathname.startsWith(href + "/")) {
      return true;
    }

    return false;
  };

  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-border shadow-lg z-50 ${className}`}
    >
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = getIsActive(item.href);
          const Icon = item.icon;

          const handleClick = (e: React.MouseEvent) => {
            if (onNavClick) {
              e.preventDefault();
              onNavClick(item.href);
            }
          };

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-200 group rounded-lg active:scale-95 active:bg-primary/20 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary "
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              />
              <span
                className={`text-xs font-medium truncate transition-colors duration-200 font-poppins ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Universal active state checker for navigation items
 *
 * This function determines if a navigation item should be marked as active
 * based on the current pathname. It supports both exact matches and nested routes.
 *
 * Logic:
 * 1. Exact match: pathname === href
 * 2. Nested route: pathname starts with href + "/"
 *
 * This approach works universally for any navigation structure:
 * - Base routes: /franchisee/home, /franchisor/dashboard, /admin/users
 * - Nested routes: /franchisee/profile/account, /franchisor/franchise/manage
 * - Deep nesting: /admin/users/edit/123/permissions
 *
 * Example usage scenarios that this logic now supports:
 *
 * FOR FRANCHISEE:
 * - When at "/franchisee/home" -> "Home" tab active
 * - When at "/franchisee/home/detail/123" -> "Home" tab active
 * - When at "/franchisee/event" -> "Event" tab active
 * - When at "/franchisee/event/workshop/register" -> "Event" tab active
 * - When at "/franchisee/franchise" -> "Franchise" tab active
 * - When at "/franchisee/franchise/search?category=food" -> "Franchise" tab active
 * - When at "/franchisee/notification" -> "Notification" tab active
 * - When at "/franchisee/notification/unread" -> "Notification" tab active
 * - When at "/franchisee/profile" -> "Profile" tab active
 * - When at "/franchisee/profile/account" -> "Profile" tab active
 * - When at "/franchisee/profile/documents" -> "Profile" tab active
 * - When at "/franchisee/profile/help" -> "Profile" tab active
 * - When at "/franchisee/profile/privacy" -> "Profile" tab active
 *
 * FOR FRANCHISOR & ADMIN:
 * - Same logic applies with their respective base paths
 * - "/franchisor/franchise/manage/123/edit" -> "Franchise" tab active
 * - "/admin/users/permissions/role/edit" -> "Users" tab active
 *
 * @param href - The navigation item's href (base path)
 * @returns boolean - Whether the navigation item should be active
 */
