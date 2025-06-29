// app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import PWAStatus from "@/components/pwa-status";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins", // ini akan menjadi class CSS
});

export const metadata = {
  title: "EazyChise - Franchisee/Franchisor Platform",
  description: "Platform terbaik untuk franchisee dan franchisor di Indonesia",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EazyChise",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "EazyChise",
    title: "EazyChise - Franchisee/Franchisor Platform",
    description:
      "Platform terbaik untuk franchisee dan franchisor di Indonesia",
  },
  twitter: {
    card: "summary",
    title: "EazyChise - Franchisee/Franchisor Platform",
    description:
      "Platform terbaik untuk franchisee dan franchisor di Indonesia",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={poppins.variable}>
      <head>
        <meta name="application-name" content="EazyChise" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EazyChise" />
        <meta
          name="description"
          content="Platform terbaik untuk franchisee dan franchisor di Indonesia"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />

        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.svg" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://eazychise.com" />
        <meta name="twitter:title" content="EazyChise" />
        <meta
          name="twitter:description"
          content="Platform terbaik untuk franchisee dan franchisor di Indonesia"
        />
        <meta name="twitter:image" content="/favicon.svg" />
        <meta name="twitter:creator" content="@eazychise" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="EazyChise" />
        <meta
          property="og:description"
          content="Platform terbaik untuk franchisee dan franchisor di Indonesia"
        />
        <meta property="og:site_name" content="EazyChise" />
        <meta property="og:url" content="https://eazychise.com" />
        <meta property="og:image" content="/favicon.svg" />
      </head>
      <body className="font-poppins">
        {children}
        <PWAInstallPrompt />
        {process.env.NODE_ENV === "development" && <PWAStatus />}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
