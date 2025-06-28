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
  Phone,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import withAuth from "@/lib/withAuth";

function FranchisorAccountPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [franchiseId, setFranchiseId] = useState<string | null>(null);

  // State for user and franchise data
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    avatar: "/image/auth/login.png",
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

  useEffect(() => {
    const fetchUserAndFranchiseData = async () => {
      try {
        setLoading(true);

        // First get user data to get the user ID
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

        const userData = await userResponse.json();

        if (userData.success) {
          const franchiseFetchResponse = await fetch(
            `/api/franchises/${userData.data.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (!franchiseFetchResponse.ok) {
            throw new Error("Failed to fetch franchise data");
          }

          const franchiseData = await franchiseFetchResponse.json();

          if (franchiseData.success && franchiseData.data.length > 0) {
            const franchise = franchiseData.data[0];
            setFranchiseId(franchise.id);

            // Now fetch detailed franchise data
            const franchiseDetailResponse = await fetch(
              `/api/franchises/${franchise.id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );

            if (!franchiseDetailResponse.ok) {
              throw new Error("Failed to fetch franchise details");
            }

            const franchiseDetailData = await franchiseDetailResponse.json();

            if (franchiseDetailData.success) {
              const detail = franchiseDetailData.data;

              setUserData({
                id: userData.data.id,
                name: userData.data.name || "",
                email: userData.data.email || "",
                phone: userData.data.phone || "",
                role: userData.data.role || "",
                status: userData.data.status || "",
                avatar: "/image/auth/login.png",
              });

              setFranchiseData({
                id: detail.id,
                name: detail.name || "",
                price: detail.price || 0,
                image: detail.image || "/image/auth/login.png",
                status: detail.status || "OPEN",
                location: detail.location || "",
                ownership_document: detail.ownership_document || "",
                financial_statement: detail.financial_statement || "",
                proposal: detail.proposal || "",
                sales_location: detail.sales_location || "",
                equipment: detail.equipment || "",
                materials: detail.materials || "",
                listing_documents: detail.listing_documents || [],
                listings_highlights: detail.listings_highlights || [],
              });

              setEditData({
                id: detail.id,
                name: detail.name || "",
                price: detail.price || 0,
                image: detail.image || "/image/auth/login.png",
                status: detail.status || "OPEN",
                location: detail.location || "",
                ownership_document: detail.ownership_document || "",
                financial_statement: detail.financial_statement || "",
                proposal: detail.proposal || "",
                sales_location: detail.sales_location || "",
                equipment: detail.equipment || "",
                materials: detail.materials || "",
                listing_documents: detail.listing_documents || [],
                listings_highlights: detail.listings_highlights || [],
              });
            }
          } else {
            toast.error("No franchise found for this user");
          }
        } else {
          throw new Error(userData.error || "Failed to fetch user data");
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

  const handleSave = async () => {
    if (!franchiseId) {
      toast.error("Tidak ada franchise yang ditemukan");
      return;
    }

    setSaving(true);
    try {
      // Prepare franchise data update
      const updatePayload = {
        name: editData.name,
        price: editData.price,
        image: editData.image,
        status: editData.status,
        location: editData.location,
        ownership_document: editData.ownership_document,
        financial_statement: editData.financial_statement,
        proposal: editData.proposal,
        sales_location: editData.sales_location,
        equipment: editData.equipment,
        materials: editData.materials,
      };

      // Update franchise data
      const franchiseResponse = await fetch(`/api/franchises/${franchiseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
        credentials: "include",
      });

      if (!franchiseResponse.ok) {
        const errorData = await franchiseResponse.json();
        throw new Error(errorData.error || "Failed to update franchise");
      }

      await franchiseResponse.json();
      setFranchiseData({
        ...franchiseData,
        ...updatePayload,
      });

      // Update user data separately if needed
      const userResponse = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
        }),
        credentials: "include",
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

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
    setEditData(franchiseData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditData((prev) => ({
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
                <Label className="text-xs text-gray-500">Email</Label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-gray-500" />
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>

              {userData.phone && (
                <div>
                  <Label className="text-xs text-gray-500">Nomor Telepon</Label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Franchise Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Franchise
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

            {/* Franchise Image */}
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-gray-500">Foto Franchise</Label>
                <div className="mt-2 relative h-60 w-full md:w-3/4 border rounded-md overflow-hidden">
                  <Image
                    src={franchiseData.image || "/image/auth/login.png"}
                    alt="Franchise Image"
                    width={600}
                    height={400}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <Label
                  htmlFor="franchise-name"
                  className="text-xs text-gray-500"
                >
                  Nama Franchise
                </Label>
                {isEditing ? (
                  <Input
                    id="franchise-name"
                    value={editData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Masukkan nama franchise"
                  />
                ) : (
                  <p className="font-medium">{franchiseData.name}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <Label
                  htmlFor="franchise-price"
                  className="text-xs text-gray-500"
                >
                  Harga Franchise
                </Label>
                {isEditing ? (
                  <Input
                    id="franchise-price"
                    type="number"
                    value={editData.price}
                    onChange={(e) =>
                      handleInputChange("price", Number(e.target.value))
                    }
                    placeholder="Masukkan harga franchise"
                  />
                ) : (
                  <p className="font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(franchiseData.price)}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label
                  htmlFor="franchise-status"
                  className="text-xs text-gray-500"
                >
                  Status
                </Label>
                {isEditing ? (
                  <div className="flex gap-4 mt-1">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status-open"
                        checked={editData.status === "OPEN"}
                        onChange={() => handleInputChange("status", "OPEN")}
                        className="mr-2"
                      />
                      <label htmlFor="status-open">Buka</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status-closed"
                        checked={editData.status === "CLOSED"}
                        onChange={() => handleInputChange("status", "CLOSED")}
                        className="mr-2"
                      />
                      <label htmlFor="status-closed">Tutup</label>
                    </div>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-2 text-xs rounded-full font-semibold w-fit ${
                      franchiseData.status === "OPEN"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {franchiseData.status === "OPEN" ? "Buka" : "Tutup"}
                  </span>
                )}
              </div>

              {/* Location */}
              <div>
                <Label
                  htmlFor="franchise-location"
                  className="text-xs text-gray-500"
                >
                  Lokasi
                </Label>
                {isEditing ? (
                  <Input
                    id="franchise-location"
                    value={editData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="Masukkan lokasi franchise"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="font-medium">{franchiseData.location}</p>
                  </div>
                )}
              </div>

              {/* Sales Location */}
              <div>
                <Label
                  htmlFor="sales-location"
                  className="text-xs text-gray-500"
                >
                  Lokasi Penjualan
                </Label>
                {isEditing ? (
                  <Input
                    id="sales-location"
                    value={editData.sales_location}
                    onChange={(e) =>
                      handleInputChange("sales_location", e.target.value)
                    }
                    placeholder="Masukkan lokasi penjualan"
                  />
                ) : (
                  <p className="font-medium">{franchiseData.sales_location}</p>
                )}
              </div>

              {/* Equipment */}
              <div>
                <Label htmlFor="equipment" className="text-xs text-gray-500">
                  Peralatan
                </Label>
                {isEditing ? (
                  <Input
                    id="equipment"
                    value={editData.equipment}
                    onChange={(e) =>
                      handleInputChange("equipment", e.target.value)
                    }
                    placeholder="Masukkan peralatan yang disediakan"
                  />
                ) : (
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="font-medium">{franchiseData.equipment}</p>
                  </div>
                )}
              </div>

              {/* Materials */}
              <div>
                <Label htmlFor="materials" className="text-xs text-gray-500">
                  Bahan-bahan
                </Label>
                {isEditing ? (
                  <Input
                    id="materials"
                    value={editData.materials}
                    onChange={(e) =>
                      handleInputChange("materials", e.target.value)
                    }
                    placeholder="Masukkan bahan-bahan yang disediakan"
                  />
                ) : (
                  <div className="flex items-center">
                    <Coffee className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="font-medium">{franchiseData.materials}</p>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <Label className="text-xs text-gray-500 block mb-2">
                  Dokumen
                </Label>
                <div className="space-y-2">
                  <a
                    href={franchiseData.ownership_document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Sertifikat Kepemilikan</span>
                  </a>
                  <a
                    href={franchiseData.financial_statement}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Laporan Keuangan</span>
                  </a>
                  <a
                    href={franchiseData.proposal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Proposal</span>
                  </a>
                </div>
              </div>

              {/* Listing Documents */}
              {franchiseData.listing_documents &&
                franchiseData.listing_documents.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-500 block mb-2">
                      Dokumen Listing
                    </Label>
                    <div className="space-y-2">
                      {franchiseData.listing_documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{doc.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Listing Highlights */}
              {franchiseData.listings_highlights &&
                franchiseData.listings_highlights.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-500 block mb-2">
                      Keunggulan
                    </Label>
                    <div className="space-y-3">
                      {franchiseData.listings_highlights.map(
                        (highlight, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 rounded-md"
                          >
                            <h3 className="font-medium text-sm">
                              {highlight.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {highlight.content}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
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
    </FranchisorLayout>
  );
}

// Export the component with authentication
export default withAuth(FranchisorAccountPage, "FRANCHISOR");
