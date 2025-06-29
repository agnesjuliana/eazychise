"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone, Zap, Wifi } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For iOS, show install prompt if not in standalone mode
    if (
      isIOSDevice &&
      !window.matchMedia("(display-mode: standalone)").matches
    ) {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (
        !dismissed ||
        Date.now() - parseInt(dismissed) > 7 * 24 * 60 * 60 * 1000
      ) {
        setShowInstallPrompt(true);
      }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store in localStorage to not show again for a while
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Check if user previously dismissed the prompt (within last 7 days)
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (dismissedTime > weekAgo) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  // Don't show if already installed
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallPrompt(false);
    }
  }, []);

  if (!showInstallPrompt) {
    return null;
  }

  const IOSInstallInstructions = () => (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <div className="bg-white rounded-t-xl max-w-sm w-full p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">
            Install EazyChise App
          </h3>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Install aplikasi EazyChise untuk pengalaman yang lebih baik:
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-semibold">
                1
              </div>
              <span>
                Tap tombol <strong>Share</strong> di browser Safari
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-semibold">
                2
              </div>
              <span>
                Pilih <strong>&quot;Add to Home Screen&quot;</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-semibold">
                3
              </div>
              <span>
                Tap <strong>&quot;Add&quot;</strong> untuk menginstall
              </span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 text-sm">
              <Smartphone className="w-4 h-4" />
              <span className="font-medium">Manfaat Install App:</span>
            </div>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Akses lebih cepat dari home screen</li>
              <li>• Notifikasi push untuk update terbaru</li>
              <li>• Bekerja offline untuk fitur tertentu</li>
            </ul>
          </div>
        </div>

        <Button variant="outline" onClick={handleDismiss} className="w-full">
          Nanti saja
        </Button>
      </div>
    </div>
  );

  if (isIOS) {
    return <IOSInstallInstructions />;
  }

  if (!deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm mx-auto">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            Install EazyChise App
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Dapatkan akses cepat dan pengalaman yang lebih baik dengan
            menginstall aplikasi EazyChise.
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Fast</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>Offline</span>
            </div>
            <div className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              <span>Native Feel</span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="text-xs h-8"
            >
              Install App
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="text-xs h-8"
            >
              Nanti saja
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
