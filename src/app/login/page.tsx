"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Image
            src="/image/auth/login.png"
            alt="Login Illustration"
            width={200}
            height={200}
            priority
          />
        </div>

        <h1 className="text-center text-2xl font-bold text-black">MASUK</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Dwiyanto28@email.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password">Kata Sandi</Label>
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

          <Button
            type="submit"
            className="w-full rounded-md bg-[#EF5A5A] text-white hover:bg-[#e44d4d]"
          >
            MASUK
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#EF5A5A] font-medium hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
