// app/layout.tsx
import "./globals.css"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins", // ini akan menjadi class CSS
})

export const metadata = {
  title: "EazyChise",
  description: "Franchisee/Franchisor Platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="font-poppins">{children}</body>
    </html>
  )
}
