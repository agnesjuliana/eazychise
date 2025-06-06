'use client';

import { ReactNode } from 'react';
import BottomNavbar from './bottom-navbar';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  showBottomNav?: boolean;
}

export default function AppLayout({
  children,
  className = '',
  showBottomNav = true,
}: AppLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 flex justify-center ${className}`}>
      <div className='w-full max-w-md relative'>
        {/* Main content area */}
        <main className={`${showBottomNav ? 'pb-16' : ''}`}>{children}</main>

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNavbar />}
      </div>
    </div>
  );
}
