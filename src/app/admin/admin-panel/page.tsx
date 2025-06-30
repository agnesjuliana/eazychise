"use client";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { User as UserType } from "@/type/user";
import React from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "@/components/admin-layout";
import withAuth from "@/lib/withAuth";

function AdminVerifyPage() {
  const [role, setRole] = React.useState<string>("FRANCHISEE");
  const [status, setStatus] = React.useState<string>("all");
  const [user, setUser] = React.useState<UserType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        // Try to fetch all users with a large per_page value first
        const response = await fetch(`/api/user?page=1&per_page=1000`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (data.status && data.data) {
          // Check if we got all users or need to fetch more
          const meta = data.meta;

          if (meta && meta.total_pages > 1) {
            // If there are more pages, fetch them
            let allUsers: UserType[] = [...data.data];

            for (let page = 2; page <= meta.total_pages; page++) {
              const pageResponse = await fetch(
                `/api/user?page=${page}&per_page=1000`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );

              if (pageResponse.ok) {
                const pageData = await pageResponse.json();
                if (pageData.status && pageData.data) {
                  allUsers = [...allUsers, ...pageData.data];
                }
              }
            }

            setUser(allUsers);
          } else {
            // All users fetched in single request
            setUser(data.data as UserType[]);
          }
        } else {
          console.error("Failed to fetch user data:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const userRender = React.useMemo(() => {
    console.log("user", user);
    return user
      .filter((u) => u.role === role)
      .filter((u) => u.status === status || status === "all");
  }, [user, role, status]);

  console.log("userRender", userRender);
  const headerHeight = 162 + 20 + 44 + 16 + 44 + 16; // Perkiraan tinggi total elemen fixed

  return (
    <AdminLayout>
      {/* Fixed Header dan Button */}
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-10 max-w-md mx-auto bg-gray-50 w-full">
        {/* Custom Header dengan Back Button Integrated */}
        <div className="bg-[#EF5A5A] h-[162px] w-full relative rounded-b-[10px] flex items-center justify-center">
          {/* Cloud decorations - existing */}
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute -top-[20px] left-[80px]"
          />
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute bottom-[45px] left-[0px]"
          />
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute top-[20px] -right-[40px]"
          />
          <Image
            src="/image/cloud.png"
            alt="Cloud Element"
            width={62}
            height={41}
            className="absolute bottom-[10px] right-[40px]"
          />

          {/* Title */}
          <div className="text-center text-white">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-sm opacity-90">Verifikasi Akun</p>
          </div>
        </div>

        {/* Role Filter */}
        <div className="flex w-full items-center px-2 bg-gray-50 justify-around">
          <Button
            onClick={() => setRole("FRANCHISEE")}
            variant="ghost"
            size="lg"
            disabled={role === "FRANCHISEE"}
            className={`relative px-3 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none ${
              role === "FRANCHISEE"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#EF5A5A]"
                : "text-black hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Franchisee
          </Button>
          <Button
            onClick={() => setRole("FRANCHISOR")}
            variant="ghost"
            size="lg"
            disabled={role === "FRANCHISOR"}
            className={`relative px-3 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none ${
              role === "FRANCHISOR"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#EF5A5A]"
                : "text-black hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Franchisor
          </Button>
        </div>

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
            onClick={() => setStatus("WAITING")}
            variant="ghost"
            size="sm"
            disabled={status === "WAITING"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "WAITING"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Pending
          </Button>
          <Button
            onClick={() => setStatus("ACCEPTED")}
            variant="ghost"
            size="sm"
            disabled={status === "ACCEPTED"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "ACCEPTED"
                ? "text-[#EF5A5A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#EF5A5A]"
                : "text-gray-600 hover:bg-transparent hover:text-[#EF5A5A]"
            }`}
          >
            Aktif
          </Button>
          <Button
            onClick={() => setStatus("REJECTED")}
            variant="ghost"
            size="sm"
            disabled={status === "REJECTED"}
            className={`relative px-2 disabled:opacity-100 cursor-pointer rounded-none border-0 shadow-none text-xs ${
              status === "REJECTED"
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
                        u.status === "WAITING"
                          ? "bg-yellow-100 text-yellow-800"
                          : u.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.status === "WAITING"
                        ? "Pending"
                        : u.status === "ACCEPTED"
                        ? "Aktif"
                        : "Ditolak"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
                <Link href={`/admin/admin-panel/${u.id}`}>
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
              <p className="text-gray-500 mb-2">
                Tidak ada akun{" "}
                {role === "FRANCHISOR" ? "Franchisor" : "Franchisee"}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AdminVerifyPage, "ADMIN");
