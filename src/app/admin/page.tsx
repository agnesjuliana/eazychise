"use client";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { User } from "@/type/user";
import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminVerifyPage() {
  const [role, setRole] = React.useState<string>("franchisee");
  const [user, setUser] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("api/user?status=pending", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        if (data.success) {
          setUser(data.users);
        } else {
          console.error("Failed to fetch user data:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const userRender = React.useMemo(() => {
    return user.filter((u) => u.role === role);
  }, [user, role]); // Menghitung tinggi header dan switch (162px header + padding bottom/top + tinggi tombol + gap)
  const headerHeight = 162 + 20 + 44 + 16; // Perkiraan tinggi total elemen fixed

  return (
    <div className="min-h-screen flex flex-col items-center px-0 pb-10 bg-white max-w-[420px] m-auto w-full">
      {/* Fixed Header dan Button */}
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-10 max-w-[420px] mx-auto">
        <HeaderPage title="Verifikasi Akun" />
        <div className="flex w-full items-center justify-center gap-2 px-2 pb-2">
          <Button
            onClick={() => setRole("franchisee")}
            variant="outline"
            size="lg"
            disabled={role === "franchisee"}
            className={`disabled:opacity-100 cursor-pointer ${
              role === "franchisee" ? "bg-[#EF5A5A] text-white " : ""
            }`}
          >
            Franchisee
          </Button>
          <Button
            onClick={() => setRole("franchisor")}
            variant="outline"
            size="lg"
            disabled={role === "franchisor"}
            className={`disabled:opacity-100 cursor-pointer ${
              role === "franchisor" ? "bg-[#EF5A5A] text-white " : ""
            }`}
          >
            Franchisor
          </Button>
        </div>
      </div>
      {/* Spacer untuk memberikan ruang agar konten tidak tertimpa header */}
      <div style={{ height: `${headerHeight}px` }} className="w-full"></div>
      {/* Konten Utama */}{" "}
      <div className="flex flex-col gap-4 w-full px-4">
        <div className="flex flex-col gap-3 w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#EF5A5A] mb-2" />
              <p className="text-gray-500">Mengambil data akun...</p>
            </div>
          ) : userRender.length > 0 ? (
            userRender.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-semibold">{u.name}</h3>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#EF5A5A] hover:bg-[#c84d4d] active:bg-[#b04545] cursor-pointer text-white"
                >
                  Details
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-gray-500 mb-2">
                Tidak ada akun {role} yang perlu diverifikasi
              </p>
              <p className="text-sm text-gray-400">
                Semua akun sudah disetujui atau ditolak
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
