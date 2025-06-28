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
    return mounted ? pathname === href : false;
  };

  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg z-50 ${className}`}
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
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-200 group rounded-lg active:scale-95 active:bg-red-200 ${
                isActive ? "text-red-500" : "text-gray-500 hover:text-red-500 "
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-colors duration-200 ${
                  isActive
                    ? "text-red-500"
                    : "text-gray-500 group-hover:text-red-500"
                }`}
              />
              <span
                className={`text-xs font-medium truncate transition-colors duration-200 ${
                  isActive
                    ? "text-red-500"
                    : "text-gray-500 group-hover:text-red-500"
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
