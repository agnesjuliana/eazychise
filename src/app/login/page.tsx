"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Email dan password wajib diisi")
      return
    }

    if (!isValidEmail(formData.email)) {
      setError("Format email tidak valid")
      return
    }

    setIsLoading(true)
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    setIsLoading(false)

    if (!res.ok) {
      setError(data.error || "Login gagal")
      return
    }

    setDialogOpen(true)
    setTimeout(() => {
      if (data.user?.role === "admin") {
        router.push("/admin")
      } else if (data.user?.status === "pending") {
        router.push("/verifikasi")
      } else {
        router.push("/", )
      }
    }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Login Berhasil!</DialogTitle>
            <DialogDescription>
              Mohon tunggu, sedang mengarahkan...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-sm p-6 shadow-xl rounded-2xl border border-gray-200">
        <div className="flex justify-center mb-4">
          <Image
            src="/image/auth/login.png"
            alt="Login Illustration"
            width={200}
            height={200}
            priority
          />
        </div>
        <h1 className="text-center text-2xl font-bold text-black mb-2">MASUK</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              autoComplete="email"
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
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="••••••"
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
            disabled={!formData.email || !formData.password || isLoading}
            className="w-full rounded-md bg-[#EF5A5A] text-white hover:bg-[#e44d4d] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "MASUK"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/start" className="text-[#EF5A5A] font-medium hover:underline">
              Daftar
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
