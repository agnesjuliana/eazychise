"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";

function VerifikasiPage() {
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const response = await fetch("/api/login", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();

        if (data.isLoggedIn && data.user.status === "active") {
          setIsVerified(true);
          router.push("/start");
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };

    checkVerificationStatus();

    // Recheck status every 30 seconds
    const interval = setInterval(checkVerificationStatus, 30000);

    return () => clearInterval(interval);
  }, [router]);

  if (isVerified) {
    return <div>Redirecting...</div>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <Card className="w-full max-w-sm text-center p-6 shadow-xl space-y-3 rounded-2xl border border-gray-200">
        {/* Back Button di dalam card */}
        <div className="flex justify-start mb-2">
          <BackButton fallbackUrl="/login" variant="ghost" size="sm" />
        </div>

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
        <div className="flex flex-col gap-3 mt-2">
          <Link href="https://wa.link/uqnuy1">
            <Button className="w-full bg-[#EF5A5A] hover:bg-[#e44d4d]">
              Hubungi Admin
            </Button>
          </Link>
          <Button
            className="w-full bg-gray-200 hover:bg-gray-300 text-black"
            onClick={() => router.refresh()}
          >
            Refresh Status
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default withAuth(VerifikasiPage, "VERIFICATION");