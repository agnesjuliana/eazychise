// app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins", // ini akan menjadi class CSS
});

export const metadata = {
  title: "EazyChise - Franchisee/Franchisor Platform",
  description: "Franchisee/Franchisor Platform",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="font-poppins">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
