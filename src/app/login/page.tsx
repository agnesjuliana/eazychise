// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import withAuth from "@/lib/withAuth";
import { Card } from "@/components/ui/card";
import useAuthStore from "@/store/authStore";
import {
  callLoginAPI,
  getUserRedirectPath,
  showSuccessToast,
} from "@/lib/authUtils";

function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get login action from auth store
  const { useLogin } = useAuthStore;
  const login = useLogin();

  const updateField = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setError("");
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email dan password wajib diisi");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError("Format email tidak valid");
      return;
    }

    setIsLoading(true);
    try {
      const data = await callLoginAPI(formData.email, formData.password);

      // Update auth store immediately for seamless transition
      login(data.user, data.token || "");
      showSuccessToast("Login berhasil!");

      // Redirect immediately without delay
      const redirectPath = getUserRedirectPath(data.user);
      router.replace(redirectPath);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login gagal";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <Card className="w-full max-w-sm p-6 shadow-xl rounded-2xl border">
        {/* Back Button di dalam card */}
        <div className="flex justify-start mb-2">
          <BackButton fallbackUrl="/start" variant="ghost" size="sm" />
        </div>

        <div className="flex justify-center mb-4">
          <Image
            src="/image/auth/login.png"
            alt="Login Illustration"
            width={200}
            height={200}
            priority
          />
        </div>

        <h1 className="text-center text-2xl font-bold mb-2">MASUK</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              autoComplete="email"
              disabled={isLoading}
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Masukkan Alamat Email"
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="••••••"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            disabled={!formData.email || !formData.password || isLoading}
            className="w-full bg-[#EF5A5A] text-white hover:bg-[#e44d4d] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "MASUK"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/start"
              className="text-[#EF5A5A] font-medium hover:underline"
            >
              Daftar
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default withAuth(LoginPage, "GUEST");
