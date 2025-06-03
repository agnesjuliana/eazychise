"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Image
            src="/image/auth/register.png"
            alt="Register Illustration"
            width={200}
            height={200}
            priority
          />
        </div>

        <h1 className="text-center text-2xl font-bold text-black">DAFTAR</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              placeholder="Masukkan Nama Lengkap"
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan Alamat Email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password">Buat Kata Sandi</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full rounded-md bg-[#EF5A5A] text-white hover:bg-[#e44d4d]"
          >
            DAFTAR
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#EF5A5A] font-medium hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
