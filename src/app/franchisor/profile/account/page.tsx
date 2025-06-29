"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Mail,
  Edit3,
  Save,
  X,
  MapPin,
  FileText,
  Package,
  Coffee,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import withAuth from "@/lib/withAuth";

function FranchisorAccountPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [franchiseId, setFranchiseId] = useState<string | null>(null);

  // State for user and franchise data
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    status: "",
    avatar: "/image/auth/login.png",
    detail: {
      id: "",
      ktp: "",
      foto_diri: "",
    },
  });

  const [franchiseData, setFranchiseData] = useState({
    id: "",
    name: "",
    price: 0,
    image: "/image/auth/login.png",
    status: "OPEN",
    location: "",
    ownership_document: "",
    financial_statement: "",
    proposal: "",
    sales_location: "",
    equipment: "",
    materials: "",
    listing_documents: [] as Array<{
      id: string;
      name: string;
      path: string;
      type: string;
    }>,
    listings_highlights: [] as Array<{
      id: string;
      title: string;
      content: string;
    }>,
  });

  const [editData, setEditData] = useState(franchiseData);
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    ktp: "",
    foto_diri: "",
  });

  useEffect(() => {
    const fetchUserAndFranchiseData = async () => {
      try {
        setLoading(true);

        // Get user data with franchise details from /api/user/me
        const userResponse = await fetch("/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const response = await userResponse.json();

        if (response.success) {
          const data = response.data;

          // Set user data
          setUserData({
            id: data.id,
            name: data.name || "",
            email: data.email || "",
            role: data.role || "",
            status: data.status || "",
            avatar: "/image/auth/login.png",
            detail: {
              id: data.detail?.id || "",
              ktp: data.detail?.ktp || "",
              foto_diri: data.detail?.foto_diri || "",
            },
          });

          // Set edit user data
          setEditUserData({
            name: data.name || "",
            email: data.email || "",
            ktp: data.detail?.ktp || "",
            foto_diri: data.detail?.foto_diri || "",
          });

          // Set franchise data if available
          if (data.franchise) {
            const franchise = data.franchise;
            setFranchiseId(franchise.id);

            const franchiseInfo = {
              id: franchise.id,
              name: franchise.name || "",
              price: franchise.price || 0,
              image: "/image/auth/login.png",
              status: franchise.status || "OPEN",
              location: franchise.location || "",
              ownership_document: franchise.ownership_document || "",
              financial_statement: franchise.financial_statement || "",
              proposal: franchise.proposal || "",
              sales_location: franchise.sales_location || "",
              equipment: franchise.equipment || "",
              materials: franchise.materials || "",
              listing_documents: franchise.listing_documents || [],
              listings_highlights: franchise.listings_highlights || [],
            };

            setFranchiseData(franchiseInfo);
            setEditData(franchiseInfo);
          } else {
            // No franchise found for this franchisor
            toast.info("Belum ada franchise yang terdaftar");
          }
        } else {
          throw new Error(response.error || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data");
        // Redirect to login if session is invalid
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFranchiseData();
  }, [router]);

  const handleCancelProfile = () => {
    setEditUserData({
      name: userData.name,
      email: userData.email,
      ktp: userData.detail.ktp,
      foto_diri: userData.detail.foto_diri,
    });
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      // Update user profile data
      const userResponse = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editUserData.name,
          email: editUserData.email,
          ktp: editUserData.ktp,
          foto_diri: editUserData.foto_diri,
        }),
        credentials: "include",
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Update local state
      setUserData((prev) => ({
        ...prev,
        name: editUserData.name,
        email: editUserData.email,
        detail: {
          ...prev.detail,
          ktp: editUserData.ktp,
          foto_diri: editUserData.foto_diri,
        },
      }));

      setIsEditingProfile(false);
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui profil"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUserInputChange = (field: string, value: string) => {
    setEditUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  if (loading) {
    return (
      <FranchisorLayout>
        <div className="min-h-screen bg-gray-50">
          <HeaderPage title="PROFIL FRANCHISOR" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF5A5A] mx-auto"></div>
              <p className="mt-2 text-gray-500">Memuat data...</p>
            </div>
          </div>
        </div>
      </FranchisorLayout>
    );
  }

  return (
    <FranchisorLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <HeaderPage title="PROFIL FRANCHISOR" />

        {/* Back Button */}
        <div className="w-full px-4 mt-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Button>
        </div>

        {/* Profile Content */}
        <div className="px-4 mt-4 space-y-6 pb-6">
          {/* Profile Avatar and User Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Pengguna
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditingProfile ? "Batal" : "Edit"}</span>
              </Button>
            </div>

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

            {/* User Info */}
            <div className="mt-6 border-t pt-6 space-y-4">
              <div>
                <Label className="text-xs text-gray-500">Nama</Label>
                {isEditingProfile ? (
                  <Input
                    value={editUserData.name}
                    onChange={(e) =>
                      handleUserInputChange("name", e.target.value)
                    }
                    placeholder="Masukkan nama"
                  />
                ) : (
                  <p className="font-medium">{userData.name}</p>
                )}
              </div>

              <div>
                <Label className="text-xs text-gray-500">Email</Label>
                {isEditingProfile ? (
                  <Input
                    type="email"
                    value={editUserData.email}
                    onChange={(e) =>
                      handleUserInputChange("email", e.target.value)
                    }
                    placeholder="Masukkan email"
                  />
                ) : (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="font-medium">{userData.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Save/Cancel Buttons */}
            {isEditingProfile && (
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex-1 bg-[#EF5A5A] hover:bg-[#e44d4d]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savingProfile ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelProfile}
                  disabled={savingProfile}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
              </div>
            )}

            {/* Franchisor Personal Details */}
            {(userData.detail.ktp ||
              userData.detail.foto_diri ||
              isEditingProfile) && (
              <div className="mt-6 border-t pt-6 space-y-4">
                <h3 className="font-semibold text-md">Data Diri Franchisor</h3>

                <div>
                  <Label className="text-xs text-gray-500">NIK (KTP)</Label>
                  {isEditingProfile ? (
                    <Input
                      value={editUserData.ktp}
                      onChange={(e) =>
                        handleUserInputChange("ktp", e.target.value)
                      }
                      placeholder="Masukkan URL gambar KTP"
                    />
                  ) : userData.detail.ktp ? (
                    <div className="mt-2">
                      <div className="relative h-48 w-full md:w-3/4 border rounded-md overflow-hidden">
                        <Image
                          src={
                            userData.detail.ktp.startsWith("/") ||
                            userData.detail.ktp.startsWith("http://") ||
                            userData.detail.ktp.startsWith("https://")
                              ? userData.detail.ktp
                              : "/image/auth/login.png"
                          }
                          alt="KTP"
                          width={400}
                          height={240}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Belum ada KTP yang diupload
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Foto Diri</Label>
                  {isEditingProfile ? (
                    <Input
                      value={editUserData.foto_diri}
                      onChange={(e) =>
                        handleUserInputChange("foto_diri", e.target.value)
                      }
                      placeholder="Masukkan URL foto diri"
                    />
                  ) : userData.detail.foto_diri ? (
                    <div className="mt-2">
                      <div className="relative h-48 w-48 border rounded-md overflow-hidden">
                        <Image
                          src={
                            userData.detail.foto_diri.startsWith("/") ||
                            userData.detail.foto_diri.startsWith("http://") ||
                            userData.detail.foto_diri.startsWith("https://")
                              ? userData.detail.foto_diri
                              : "/image/auth/login.png"
                          }
                          alt="Foto Diri Franchisor"
                          width={192}
                          height={192}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Belum ada foto diri yang diupload
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FranchisorLayout>
  );
}

// Export the component with authentication
export default withAuth(FranchisorAccountPage, "FRANCHISOR");
