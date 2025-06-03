"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifikasiPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <Card className="w-full max-w-sm text-center p-6 shadow-xl space-y-3 rounded-2xl border border-gray-200">
        <div className="flex justify-center">
          <Image
            src="/image/auth/verifikasi.png"
            alt="Verifikasi Illustration"
            width={300}
            height={300}
            priority
          />
        </div>

        <h1 className="text-xl font-bold text-[#EF5A5A]">
          Akun Anda Belum Diverifikasi
        </h1>
        <p className="text-sm text-gray-600">
          Mohon tunggu hingga 1x24 jam untuk proses verifikasi dari admin. Jika
          sudah diverifikasi, Anda dapat login seperti biasa.
        </p>
        <Link href="https://wa.link/uqnuy1">
          <Button className="w-full bg-[#EF5A5A] hover:bg-[#e44d4d]">
            Hubungi Admin
          </Button>
        </Link>
      </Card>
    </div>
  );
}
