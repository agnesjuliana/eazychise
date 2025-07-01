"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-muted-foreground">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90">
            Kembali ke Halaman Utama
          </Button>
        </Link>
      </div>
    </div>
  );
}
