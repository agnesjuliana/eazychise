"use client";

import AppLayout from "@/components/app-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Edit3, Save, X } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AccountPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    avatar: "/image/auth/login.png",
  });

  const [editData, setEditData] = useState(userData);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (data.success) {
          const fetchedUserData = {
            name: data.data.name || "",
            email: data.data.email || "",
            role: data.data.role || "",
            status: data.data.status || "",
            avatar: "/image/auth/login.png",
          };

          setUserData(fetchedUserData);
          setEditData(fetchedUserData);
        } else {
          throw new Error(data.error || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Gagal memuat data pengguna");
        // Redirect to login if session is invalid
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
      const updatedUser = await response.json();
      const newUserData = {
        ...userData,
        name: updatedUser.data.name,
        email: updatedUser.data.email,
      };
      setUserData(newUserData);
      setEditData(newUserData);
      setIsEditing(false);
      toast.success("Data berhasil disimpan");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan data"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <HeaderPage title="AKUN" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF5A5A] mx-auto"></div>
              <p className="mt-2 text-gray-500">Memuat data...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout className="overflow-x-hidden">
      {/* Scrollable Header */}
      <div className="flex flex-col gap-4 bg-gray-50 w-full">
        <HeaderPage title="AKUN" />
      </div>
      <div className=" bg-gray-50">
        {/* Back Button */}
        <div className="w-full px-4 mt-4">
          <BackButton fallbackUrl="/franchisee/profile" />
        </div>

        {/* Profile Content */}
        <div className="px-4 mt-4">
          {/* Profile Avatar */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                <Image
                  src={userData.avatar}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userData.name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{userData.role}</p>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    userData.status === "ACCEPTED"
                      ? "bg-green-100 text-green-800"
                      : userData.status === "WAITING"
                      ? "bg-orange-100 text-orange-800"
                      : userData.status === "REVISI"
                      ? "bg-yellow-100 text-yellow-800"
                      : userData.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {userData.status}
                </span>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Pengguna
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? "Batal" : "Edit"}</span>
              </Button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label
                  htmlFor="name"
                  className="flex items-center space-x-2 mb-2"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Nama Lengkap</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {userData.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className="flex items-center space-x-2 mb-2"
                >
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>Email</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Masukkan email"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {userData.email}
                  </p>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[#EF5A5A] hover:bg-[#e44d4d]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
