"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    if (navigator.onLine) {
      window.history.back();
    } else {
      handleRefresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tidak ada koneksi internet
          </h1>
          <p className="text-gray-600">
            Sepertinya Anda sedang offline. Beberapa fitur mungkin tidak tersedia saat ini.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Wifi className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Status Koneksi: {navigator.onLine ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-xs text-blue-600">
              {navigator.onLine 
                ? 'Koneksi internet tersedia. Silakan coba lagi.'
                : 'Periksa koneksi internet Anda dan coba lagi.'
              }
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRetry} 
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="w-full"
              size="lg"
            >
              Kembali
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Fitur yang tersedia offline:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Melihat halaman yang sudah dikunjungi</li>
            <li>• Mengakses profil tersimpan</li>
            <li>• Melihat cache franchise</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
