"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-6xl font-bold text-[#EF5A5A]">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link href="/">
          <Button className="bg-[#EF5A5A] hover:bg-[#e44d4d]">
            Kembali ke Halaman Utama
          </Button>
        </Link>
      </div>
    </div>
  );
}
