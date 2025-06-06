"use client";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { User as UserType } from "@/type/user";
import React from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin-layout";

export default function AdminVerifyPage() {
  const [role, setRole] = React.useState<string>("franchisee");
  const [status, setStatus] = React.useState<string>("all");
  const [user, setUser] = React.useState<UserType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("api/user", {
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
          setUser(data.data);
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
    return user
      .filter((u) => u.role === role)
      .filter((u) => u.status === status || status === "all");
  }, [user, role, status]); // Menghitung tinggi header dan switch (162px header + padding bottom/top + tinggi tombol + gap + tinggi status filter)
  const headerHeight = 162 + 20 + 44 + 16 + 44 + 16; // Perkiraan tinggi total elemen fixed

  return (
    <AdminLayout>
      {/* Fixed Header dan Button */}
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-10 max-w-[420px] mx-auto bg-gray-50">
        <HeaderPage title="Verifikasi Akun" />
        {/* Role Filter */}
        <div className="flex w-full items-center px-2 bg-gray-50 justify-around">
          <Button
            onClick={() => setRole("franchisee")}
            variant="ghost"
            size="lg"
            disabled={role === "franchisee"}
            className={`relative px-3 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none ${
              role === "franchisee"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#EF5A5A]"
                : "text-black hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Franchisee
          </Button>
          <Button
            onClick={() => setRole("franchisor")}
            variant="ghost"
            size="lg"
            disabled={role === "franchisor"}
            className={`relative px-3 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none ${
              role === "franchisor"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#EF5A5A]"
                : "text-black hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Franchisor
          </Button>
        </div>{" "}
        {/* Status Filter */}
        <div className="flex w-full items-center px-1 bg-gray-50 justify-between border-t border-gray-200 pt-2">
          <Button
            onClick={() => setStatus("all")}
            variant="ghost"
            size="sm"
            disabled={status === "all"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "all"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Semua
          </Button>
          <Button
            onClick={() => setStatus("pending")}
            variant="ghost"
            size="sm"
            disabled={status === "pending"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "pending"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Pending
          </Button>
          <Button
            onClick={() => setStatus("revisi")}
            variant="ghost"
            size="sm"
            disabled={status === "revisi"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "revisi"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Revisi
          </Button>
          <Button
            onClick={() => setStatus("active")}
            variant="ghost"
            size="sm"
            disabled={status === "active"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "active"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Aktif
          </Button>
          <Button
            onClick={() => setStatus("rejected")}
            variant="ghost"
            size="sm"
            disabled={status === "rejected"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "rejected"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Ditolak
          </Button>
        </div>
      </div>
      {/* Spacer untuk memberikan ruang agar konten tidak tertimpa header */}
      <div
        style={{ height: `${headerHeight}px` }}
        className="w-full bg-gray-50"
      ></div>
      {/* Konten Utama */}
      <div className="flex flex-col gap-4 w-full px-4 pb-10">
        <div className="flex flex-col gap-3 w-full ">
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
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{u.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        u.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : u.status === "revisi"
                          ? "bg-orange-100 text-orange-800"
                          : u.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.status === "pending"
                        ? "Pending"
                        : u.status === "revisi"
                        ? "Revisi"
                        : u.status === "active"
                        ? "Aktif"
                        : "Ditolak"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
                <Link href={`/admin/${u.id}`}>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-[#EF5A5A] hover:bg-[#c84d4d] active:bg-[#b04545] cursor-pointer text-white"
                  >
                    Details
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-gray-500 mb-2">Tidak ada akun {role}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
