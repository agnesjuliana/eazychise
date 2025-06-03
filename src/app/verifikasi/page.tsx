"use client";

import Image from "next/image";

export default function VerifikasiPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/image/auth/verifikasi.png"
            alt="Verifikasi"
            width={300}
            height={300}
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-[#EF5A5A]">
          Akun Anda Belum Terverifikasi
        </h1>
        <p className="text-gray-700">
          Mohon tunggu proses verifikasi dari admin dalam waktu maksimal 1x24
          jam. Kami akan mengaktifkan akun Anda secepatnya.
        </p>
      </div>
    </div>
  );
}
