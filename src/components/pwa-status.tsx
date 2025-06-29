"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Info
} from "lucide-react";

export default function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<string>("checking");
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if app is installed/standalone
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);
    setIsInstalled(standalone || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          setServiceWorkerStatus(registration.active ? "active" : "registered");
        } else {
          setServiceWorkerStatus("not-registered");
        }
      }).catch(() => {
        setServiceWorkerStatus("error");
      });
    } else {
      setServiceWorkerStatus("not-supported");
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowStatus(true)}
        className="fixed bottom-20 right-4 z-40"
      >
        <Info className="w-4 h-4 mr-1" />
        PWA Status
      </Button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">PWA Status</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowStatus(false)}
          className="h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
            <span>Internet Connection</span>
          </div>
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>App Installed</span>
          </div>
          <Badge variant={isInstalled ? "default" : "secondary"}>
            {isInstalled ? "Yes" : "No"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <span>Standalone Mode</span>
          </div>
          <Badge variant={isStandalone ? "default" : "secondary"}>
            {isStandalone ? "Active" : "Browser"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {serviceWorkerStatus === "active" ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            )}
            <span>Service Worker</span>
          </div>
          <Badge 
            variant={
              serviceWorkerStatus === "active" ? "default" : 
              serviceWorkerStatus === "registered" ? "secondary" : 
              "destructive"
            }
          >
            {serviceWorkerStatus === "active" ? "Active" :
             serviceWorkerStatus === "registered" ? "Registered" :
             serviceWorkerStatus === "not-registered" ? "Not Registered" :
             serviceWorkerStatus === "not-supported" ? "Not Supported" :
             serviceWorkerStatus === "checking" ? "Checking..." : "Error"}
          </Badge>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              PWA is disabled in development mode
            </p>
          </div>
        )}

        {!isInstalled && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2">
              Install untuk pengalaman app terbaik
            </p>
            <Button size="sm" className="w-full">
              <Download className="w-3 h-3 mr-1" />
              Install App
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
