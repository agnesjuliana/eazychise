"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function StartPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10">
      <Card className="max-w-sm w-full text-center space-y-6 p-6 shadow-xl rounded-2xl border border-gray-200">
        <div className="flex justify-center">
          <Image
            src="/image/auth/start.png"
            alt="Start Illustration"
            width={300}
            height={300}
            priority
          />
        </div>

        <h1 className="text-xl font-bold text-black">
          Mulai Bisnismu Tanpa Overthinking!
        </h1>
        <p className="text-sm text-gray-600">
          Dapatkan informasi mengenai franchise secara lengkap dan terpercaya!
        </p>

        <div className="flex flex-col space-y-3">
          <Link href="/register/franchisee">
            <Button className="w-full bg-[#EF5A5A] hover:bg-[#e44d4d]">
              DAFTAR SEBAGAI FRANCHISEE
            </Button>
          </Link>
          <Link href="/register/franchisor">
            <Button className="w-full bg-[#EF5A5A] hover:bg-[#e44d4d]">
              DAFTAR SEBAGAI FRANCHISOR
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-[#EF5A5A] font-medium hover:underline"
          >
            Masuk
          </Link>
        </p>
      </Card>
    </div>
  );
}