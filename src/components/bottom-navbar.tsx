'use client';

import { Bell, Building2, Calendar, Home, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavbarProps {
  className?: string;
}

export default function BottomNavbar({ className = '' }: BottomNavbarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/home',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/event',
      label: 'Event',
      icon: Calendar,
    },
    {
      href: '/franchise',
      label: 'Franchise',
      icon: Building2,
    },
    {
      href: '/notification',
      label: 'Notification',
      icon: Bell,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
    },
  ];
  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg z-50 ${className}`}
    >
      <div className='flex items-center justify-around h-16 px-4'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-200 group rounded-lg active:scale-95 active:bg-red-200 ${
                isActive ? 'text-red-500' : 'text-gray-500 hover:text-red-500 '
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-colors duration-200 ${
                  isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'
                }`}
              />
              <span
                className={`text-xs font-medium truncate transition-colors duration-200 ${
                  isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'
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
