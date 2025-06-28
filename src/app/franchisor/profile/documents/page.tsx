"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
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

function FranchisorDocumentsPage() {
  const router = useRouter();
  const [isEditingFranchise, setIsEditingFranchise] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingFranchise, setSavingFranchise] = useState(false);

  // State for franchise data
  const [franchiseData, setFranchiseData] = useState({
    id: "",
    name: "",
    price: 0,
    image: "/image/auth/login.png",
    location: "",
    status: "OPEN",
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

  const [editFranchiseData, setEditFranchiseData] = useState({
    name: "",
    price: 0,
    image: "/image/auth/login.png",
    location: "",
    status: "OPEN",
    ownership_document: "",
    financial_statement: "",
    proposal: "",
    sales_location: "",
    equipment: "",
    materials: "",
  });

  useEffect(() => {
    const fetchFranchiseData = async () => {
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

        if (response.success && response.data) {
          const data = response.data;

          // Set franchise data if available
          if (data.franchise) {
            const franchise = data.franchise;

            setFranchiseData({
              id: franchise.id || "",
              name: franchise.name || "",
              price: franchise.price || 0,
              image: "/image/auth/login.png",
              location: franchise.location || "",
              status: franchise.status || "OPEN",
              ownership_document: franchise.ownership_document || "",
              financial_statement: franchise.financial_statement || "",
              proposal: franchise.proposal || "",
              sales_location: franchise.sales_location || "",
              equipment: franchise.equipment || "",
              materials: franchise.materials || "",
              listing_documents: franchise.listing_documents || [],
              listings_highlights: franchise.listings_highlights || [],
            });

            // Set edit franchise data
            setEditFranchiseData({
              name: franchise.name || "",
              price: franchise.price || 0,
              image: franchise.image || "/image/auth/login.png",
              location: franchise.location || "",
              status: franchise.status || "OPEN",
              ownership_document: franchise.ownership_document || "",
              financial_statement: franchise.financial_statement || "",
              proposal: franchise.proposal || "",
              sales_location: franchise.sales_location || "",
              equipment: franchise.equipment || "",
              materials: franchise.materials || "",
            });
          } else {
            // No franchise found for this franchisor
            toast.info("Belum ada franchise yang terdaftar");
          }
        }
      } catch (error) {
        console.error("Error fetching franchise data:", error);
        toast.error("Gagal memuat data franchise");
      } finally {
        setLoading(false);
      }
    };

    fetchFranchiseData();
  }, [router]);

  const handleCancelFranchise = () => {
    setEditFranchiseData({
      name: franchiseData.name,
      price: franchiseData.price,
      image: franchiseData.image,
      location: franchiseData.location,
      status: franchiseData.status,
      ownership_document: franchiseData.ownership_document,
      financial_statement: franchiseData.financial_statement,
      proposal: franchiseData.proposal,
      sales_location: franchiseData.sales_location,
      equipment: franchiseData.equipment,
      materials: franchiseData.materials,
    });
    setIsEditingFranchise(false);
  };

  const handleSaveFranchise = async () => {
    setSavingFranchise(true);
    try {
      // Update franchise data
      const franchiseResponse = await fetch(
        `/api/franchises/${franchiseData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFranchiseData),
          credentials: "include",
        }
      );

      if (!franchiseResponse.ok) {
        const errorData = await franchiseResponse.json();
        throw new Error(errorData.error || "Failed to update franchise");
      }

      // Update local state
      setFranchiseData((prev) => ({
        ...prev,
        ...editFranchiseData,
      }));

      setIsEditingFranchise(false);
      toast.success("Data franchise berhasil diperbarui");
    } catch (error) {
      console.error("Error saving franchise:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui data franchise"
      );
    } finally {
      setSavingFranchise(false);
    }
  };

  const handleFranchiseInputChange = (
    field: string,
    value: string | number
  ) => {
    setEditFranchiseData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <FranchisorLayout>
        <div className="min-h-screen bg-gray-50">
          <HeaderPage title="DOKUMEN FRANCHISE" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF5A5A] mx-auto"></div>
              <p className="mt-2 text-gray-500">Memuat data franchise...</p>
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
        <HeaderPage title="DOKUMEN FRANCHISE" />

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

        {/* Franchise Documents Content */}
        <div className="px-4 mt-4 space-y-6 pb-6">
          {/* Franchise Information */}
          {franchiseData.id ? (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informasi Franchise
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingFranchise(!isEditingFranchise)}
                  className="flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditingFranchise ? "Batal" : "Edit"}</span>
                </Button>
              </div>

              {/* Franchise Image */}
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">
                    Foto Franchise
                  </Label>
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
                  {isEditingFranchise ? (
                    <Input
                      id="franchise-name"
                      value={editFranchiseData.name}
                      onChange={(e) =>
                        handleFranchiseInputChange("name", e.target.value)
                      }
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
                  {isEditingFranchise ? (
                    <Input
                      id="franchise-price"
                      type="number"
                      value={editFranchiseData.price}
                      onChange={(e) =>
                        handleFranchiseInputChange(
                          "price",
                          Number(e.target.value)
                        )
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
                  {isEditingFranchise ? (
                    <div className="flex gap-4 mt-1">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="status-open"
                          checked={editFranchiseData.status === "OPEN"}
                          onChange={() =>
                            handleFranchiseInputChange("status", "OPEN")
                          }
                          className="mr-2"
                        />
                        <label htmlFor="status-open">Buka</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="status-closed"
                          checked={editFranchiseData.status === "CLOSED"}
                          onChange={() =>
                            handleFranchiseInputChange("status", "CLOSED")
                          }
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
                  {isEditingFranchise ? (
                    <Input
                      id="franchise-location"
                      value={editFranchiseData.location}
                      onChange={(e) =>
                        handleFranchiseInputChange("location", e.target.value)
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
                  {isEditingFranchise ? (
                    <Input
                      id="sales-location"
                      value={editFranchiseData.sales_location}
                      onChange={(e) =>
                        handleFranchiseInputChange(
                          "sales_location",
                          e.target.value
                        )
                      }
                      placeholder="Masukkan lokasi penjualan"
                    />
                  ) : (
                    <p className="font-medium">
                      {franchiseData.sales_location}
                    </p>
                  )}
                </div>

                {/* Equipment */}
                <div>
                  <Label htmlFor="equipment" className="text-xs text-gray-500">
                    Peralatan
                  </Label>
                  {isEditingFranchise ? (
                    <Input
                      id="equipment"
                      value={editFranchiseData.equipment}
                      onChange={(e) =>
                        handleFranchiseInputChange("equipment", e.target.value)
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
                  {isEditingFranchise ? (
                    <Input
                      id="materials"
                      value={editFranchiseData.materials}
                      onChange={(e) =>
                        handleFranchiseInputChange("materials", e.target.value)
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
              {isEditingFranchise && (
                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={handleSaveFranchise}
                    disabled={savingFranchise}
                    className="flex-1 bg-[#EF5A5A] hover:bg-[#e44d4d]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {savingFranchise ? "Menyimpan..." : "Simpan"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelFranchise}
                    disabled={savingFranchise}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* No franchise found */
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="py-8">
                <Coffee className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Belum Ada Franchise Terdaftar
                </h3>
                <p className="text-gray-500 mb-6">
                  Anda belum mendaftarkan franchise. Silakan daftar franchise
                  untuk mulai berbagi peluang bisnis.
                </p>
                <Button
                  onClick={() => router.push("/franchisor/add-franchise")}
                  className="bg-[#EF5A5A] hover:bg-[#e44d4d]"
                >
                  Daftar Franchise
                </Button>
              </div>
            </div>
          )}

          {/* Additional Documents */}
          {(franchiseData.listing_documents.length > 0 ||
            franchiseData.listings_highlights.length > 0) && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dokumen Tambahan
              </h3>

              {franchiseData.listing_documents.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Dokumen Listing
                  </h4>
                  <div className="space-y-2">
                    {franchiseData.listing_documents.map((doc, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <a
                          href={doc.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{doc.name || `Dokumen ${index + 1}`}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {franchiseData.listings_highlights.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Highlights</h4>
                  <div className="space-y-2">
                    {franchiseData.listings_highlights.map(
                      (highlight, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <h3 className="font-medium text-sm">
                            {highlight.title || `Highlight ${index + 1}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {highlight.content || "Tidak ada deskripsi"}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FranchisorLayout>
  );
}

// Export the component with authentication
export default withAuth(FranchisorDocumentsPage, "FRANCHISOR");
