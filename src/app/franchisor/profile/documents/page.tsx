"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Edit3,
  Save,
  X,
  MapPin,
  FileText,
  Package,
  Coffee,
  Eye,
  Trash,
} from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import withAuth from "@/lib/withAuth";
import CloudinaryUploader, { CloudinaryUploadResult } from "@/components/CloudinaryUploader";

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

  // State for file uploads
  const [fileNames, setFileNames] = useState({
    ownership_document: "",
    financial_statement: "",
    proposal: "",
    franchise_image: "",
    new_listing_document: "",
  });

  // State for new listing documents
  const [newListingDocs, setNewListingDocs] = useState<
    Array<{
      name: string;
      path: string;
      type: string;
    }>
  >([]);

  // State for deleted listing documents (to track which ones to delete)
  const [deletedListingDocIds, setDeletedListingDocIds] = useState<string[]>(
    []
  );

  // State for managing highlights
  const [editedHighlights, setEditedHighlights] = useState<
    Array<{
      id: string;
      title: string;
      content: string;
    }>
  >([]);

  const [newHighlights, setNewHighlights] = useState<
    Array<{
      title: string;
      content: string;
    }>
  >([]);

  const [deletedHighlightIds, setDeletedHighlightIds] = useState<string[]>([]);

  const [newHighlightForm, setNewHighlightForm] = useState({
    title: "",
    content: "",
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
              image: franchise.image || "/image/auth/login.png",
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

            // Initialize edited highlights
            setEditedHighlights(franchise.listings_highlights || []);
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

    // Clear new listing documents
    setNewListingDocs([]);

    // Clear deleted listing documents
    setDeletedListingDocIds([]);

    // Reset highlights
    setEditedHighlights(franchiseData.listings_highlights || []);
    setNewHighlights([]);
    setDeletedHighlightIds([]);
    setNewHighlightForm({ title: "", content: "" });

    // Clear file names
    setFileNames({
      ownership_document: "",
      financial_statement: "",
      proposal: "",
      franchise_image: "",
      new_listing_document: "",
    });

    setIsEditingFranchise(false);
  };

  const handleSaveFranchise = async () => {
    setSavingFranchise(true);
    try {
      // Prepare the request body with existing and new listing documents
      // Filter out deleted documents from existing ones
      const filteredExistingDocs = (
        franchiseData.listing_documents || []
      ).filter((doc) => !deletedListingDocIds.includes(doc.id));

      const updatedListingDocuments = [
        // Keep existing listing documents (excluding deleted ones)
        ...filteredExistingDocs,
        // Add new listing documents
        ...newListingDocs.map((doc, index) => ({
          id: `new_${Date.now()}_${index}`, // Generate temporary ID for new documents
          id_franchise: franchiseData.id,
          type: doc.type,
          name: doc.name,
          path: doc.path,
        })),
      ];

      // Prepare highlights data
      const filteredExistingHighlights = editedHighlights.filter(
        (highlight) => !deletedHighlightIds.includes(highlight.id)
      );

      const updatedHighlights = [
        // Keep existing highlights (excluding deleted ones)
        ...filteredExistingHighlights,
        // Add new highlights with generated UUIDs
        ...newHighlights.map((highlight) => ({
          id: crypto.randomUUID(), // Generate proper UUID
          title: highlight.title,
          content: highlight.content,
        })),
      ];

      const requestBody = {
        ...editFranchiseData,
        listing_documents: updatedListingDocuments,
        listing_highlights: updatedHighlights,
      };

      console.log("Sending franchise update request:", {
        id: franchiseData.id,
        requestBody,
        highlights: updatedHighlights,
      });

      // Update franchise data
      const franchiseResponse = await fetch(
        `/api/franchises/${franchiseData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          credentials: "include",
        }
      );

      if (!franchiseResponse.ok) {
        const errorData = await franchiseResponse.json();
        console.error("Franchise update failed:", {
          status: franchiseResponse.status,
          errorData,
        });
        throw new Error(errorData.error || "Failed to update franchise");
      }

      // Update local state with new data
      setFranchiseData((prev) => ({
        ...prev,
        ...editFranchiseData,
        listing_documents: updatedListingDocuments,
        listings_highlights: updatedHighlights,
      }));

      // Clear new listing documents after successful save
      setNewListingDocs([]);

      // Clear deleted listing documents
      setDeletedListingDocIds([]);

      // Clear highlights state
      setEditedHighlights(updatedHighlights);
      setNewHighlights([]);
      setDeletedHighlightIds([]);
      setNewHighlightForm({ title: "", content: "" });

      // Clear file names
      setFileNames({
        ownership_document: "",
        financial_statement: "",
        proposal: "",
        franchise_image: "",
        new_listing_document: "",
      });

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

  const handleCloudinaryUpload =
    (field: string) => (result: CloudinaryUploadResult) => {
      if (result.secure_url) {
        if (field === "new_listing_document") {
          // Add to new listing documents array
          setNewListingDocs((prev) => [
            ...prev,
            {
              name: fileNames.new_listing_document || "Document",
              path: result.secure_url as string,
              type: "document",
            },
          ]);
          // Clear the file name for next upload
          setFileNames((prev) => ({
            ...prev,
            new_listing_document: "",
          }));
          toast.success("Dokumen listing berhasil diupload");
        } else {
          setEditFranchiseData((prev) => ({
            ...prev,
            [field]: result.secure_url,
          }));
          toast.success(`${field.replace("_", " ").replace(/^\w/, c => c.toUpperCase())} berhasil diupload`);
        }
      }
    };

  const handleRemoveNewListingDoc = (index: number) => {
    setNewListingDocs((prev) => prev.filter((_, i) => i !== index));
    toast.success("Dokumen listing dihapus");
  };

  const handleDeleteExistingListingDoc = (docId: string) => {
    setDeletedListingDocIds((prev) => [...prev, docId]);
    toast.success("Dokumen listing akan dihapus setelah disimpan");
  };

  const handleRestoreDeletedListingDoc = (docId: string) => {
    setDeletedListingDocIds((prev) => prev.filter((id) => id !== docId));
    toast.success("Dokumen listing dipulihkan");
  };

  // Highlight handlers
  const handleAddNewHighlight = () => {
    if (newHighlightForm.title.trim() && newHighlightForm.content.trim()) {
      setNewHighlights((prev) => [
        ...prev,
        {
          title: newHighlightForm.title.trim(),
          content: newHighlightForm.content.trim(),
        },
      ]);
      setNewHighlightForm({ title: "", content: "" });
      toast.success("Keunggulan baru ditambahkan");
    } else {
      toast.error("Judul dan konten keunggulan harus diisi");
    }
  };

  const handleRemoveNewHighlight = (index: number) => {
    setNewHighlights((prev) => prev.filter((_, i) => i !== index));
    toast.success("Keunggulan baru dihapus");
  };

  const handleDeleteExistingHighlight = (highlightId: string) => {
    setDeletedHighlightIds((prev) => [...prev, highlightId]);
    toast.success("Keunggulan akan dihapus setelah disimpan");
  };

  const handleRestoreDeletedHighlight = (highlightId: string) => {
    setDeletedHighlightIds((prev) => prev.filter((id) => id !== highlightId));
    toast.success("Keunggulan dipulihkan");
  };

  const handleEditHighlight = (
    index: number,
    field: "title" | "content",
    value: string
  ) => {
    setEditedHighlights((prev) =>
      prev.map((highlight, i) =>
        i === index ? { ...highlight, [field]: value } : highlight
      )
    );
  };

  const handleOpenDocument = (url: string) => {
    if (!url) {
      toast.error("Dokumen tidak tersedia");
      return;
    }

    // Open in new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getDocumentDisplayName = (url: string) => {
    if (!url) return "Tidak ada file";
    return url.split("/").pop() || "Dokumen";
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
      {/* Scrollable Header */}
      <div className="flex flex-col gap-4 bg-gray-50 w-full">
        <HeaderPage title="DOKUMEN FRANCHISE" />
      </div>

      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="px-4 pt-4">
          <BackButton fallbackUrl="/franchisor/profile" />
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
                      src={
                        isEditingFranchise
                          ? editFranchiseData.image || "/image/auth/login.png"
                          : franchiseData.image || "/image/auth/login.png"
                      }
                      alt="Franchise Image"
                      width={600}
                      height={400}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Image Upload in Edit Mode */}
                  {isEditingFranchise && (
                    <div className="mt-4">
                      <CloudinaryUploader
                        id="franchise-image"
                        title="Upload Foto Franchise Baru"
                        onUploadComplete={handleCloudinaryUpload("image")}
                        maxSizeMB={5}
                        acceptedTypes={["png", "jpg", "jpeg"]}
                        currentUrl={editFranchiseData.image}
                      />

                      {/* Show current image info */}
                      {franchiseData.image && (
                        <div className="text-xs text-gray-600 mt-2">
                          Foto saat ini:
                          <button
                            onClick={() =>
                              handleOpenDocument(franchiseData.image)
                            }
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {getDocumentDisplayName(franchiseData.image)}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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

                  {isEditingFranchise ? (
                    <div className="space-y-4">
                      {/* Ownership Document Upload */}
                      <CloudinaryUploader
                        id="ownership-document"
                        title="Sertifikat Kepemilikan"
                        onUploadComplete={handleCloudinaryUpload("ownership_document")}
                        maxSizeMB={10}
                        acceptedTypes={["pdf", "png", "jpg", "jpeg"]}
                        currentUrl={editFranchiseData.ownership_document}
                      />

                      {/* Current file display */}
                      {franchiseData.ownership_document && (
                        <div className="text-xs text-gray-600">
                          File saat ini:
                          <button
                            onClick={() =>
                              handleOpenDocument(
                                franchiseData.ownership_document
                              )
                            }
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {getDocumentDisplayName(
                              franchiseData.ownership_document
                            )}
                          </button>
                        </div>
                      )}

                      {/* Financial Statement Upload */}
                      <CloudinaryUploader
                        id="financial-statement"
                        title="Laporan Keuangan"
                        onUploadComplete={handleCloudinaryUpload("financial_statement")}
                        maxSizeMB={10}
                        acceptedTypes={["pdf", "png", "jpg", "jpeg"]}
                        currentUrl={editFranchiseData.financial_statement}
                      />

                      {/* Current file display */}
                      {franchiseData.financial_statement && (
                        <div className="text-xs text-gray-600">
                          File saat ini:
                          <button
                            onClick={() =>
                              handleOpenDocument(
                                franchiseData.financial_statement
                              )
                            }
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {getDocumentDisplayName(
                              franchiseData.financial_statement
                            )}
                          </button>
                        </div>
                      )}

                      {/* Proposal Upload */}
                      <CloudinaryUploader
                        id="proposal"
                        title="Proposal"
                        onUploadComplete={handleCloudinaryUpload("proposal")}
                        maxSizeMB={10}
                        acceptedTypes={["pdf", "png", "jpg", "jpeg"]}
                        currentUrl={editFranchiseData.proposal}
                      />

                      {/* Current file display */}
                      {franchiseData.proposal && (
                        <div className="text-xs text-gray-600">
                          File saat ini:
                          <button
                            onClick={() =>
                              handleOpenDocument(franchiseData.proposal)
                            }
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            {getDocumentDisplayName(franchiseData.proposal)}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          handleOpenDocument(franchiseData.ownership_document)
                        }
                        className="flex items-center text-blue-600 hover:underline w-full text-left"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Sertifikat Kepemilikan</span>
                        <Eye className="h-4 w-4 ml-2" />
                      </button>
                      <button
                        onClick={() =>
                          handleOpenDocument(franchiseData.financial_statement)
                        }
                        className="flex items-center text-blue-600 hover:underline w-full text-left"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Laporan Keuangan</span>
                        <Eye className="h-4 w-4 ml-2" />
                      </button>
                      <button
                        onClick={() =>
                          handleOpenDocument(franchiseData.proposal)
                        }
                        className="flex items-center text-blue-600 hover:underline w-full text-left"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Proposal</span>
                        <Eye className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Listing Documents */}
                <div>
                  <Label className="text-xs text-gray-500 block mb-2">
                    Dokumen Listing
                  </Label>

                  {/* Existing listing documents */}
                  {franchiseData.listing_documents &&
                    franchiseData.listing_documents.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {franchiseData.listing_documents.map((doc, index) => {
                          const isDeleted = deletedListingDocIds.includes(
                            doc.id
                          );

                          return (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-2 rounded transition-colors ${
                                isDeleted
                                  ? "bg-red-50 border border-red-200 opacity-60"
                                  : "hover:bg-blue-50"
                              }`}
                            >
                              <button
                                onClick={() => {
                                  if (!isDeleted) {
                                    handleOpenDocument(doc.path);
                                  }
                                }}
                                disabled={isDeleted}
                                className={`flex items-center text-left flex-1 ${
                                  isDeleted
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 hover:underline"
                                }`}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                <span
                                  className={isDeleted ? "line-through" : ""}
                                >
                                  {doc.name}
                                </span>
                                {isDeleted && (
                                  <span className="ml-2 text-xs text-red-500">
                                    (Akan dihapus)
                                  </span>
                                )}
                              </button>

                              <div className="flex items-center space-x-2">
                                {!isDeleted && !isEditingFranchise && (
                                  <Eye className="h-4 w-4" />
                                )}

                                {isEditingFranchise && (
                                  <>
                                    {!isDeleted ? (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteExistingListingDoc(doc.id)
                                        }
                                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleRestoreDeletedListingDoc(doc.id)
                                        }
                                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                                      >
                                        <span className="text-xs">
                                          Pulihkan
                                        </span>
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  {/* New listing documents (in edit mode) */}
                  {isEditingFranchise && newListingDocs.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <Label className="text-xs text-gray-600 block">
                        Dokumen Baru (Belum Disimpan)
                      </Label>
                      {newListingDocs.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-yellow-600" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveNewListingDoc(index)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload new listing document (in edit mode) */}
                  {isEditingFranchise && (
                    <div className="mt-4">
                      <CloudinaryUploader
                        id="new-listing-document"
                        title="Upload Dokumen Listing Baru"
                        onUploadComplete={handleCloudinaryUpload("new_listing_document")}
                        maxSizeMB={10}
                        acceptedTypes={[
                          "pdf",
                          "doc",
                          "docx",
                          "png",
                          "jpg",
                          "jpeg",
                        ]}
                      />
                    </div>
                  )}

                  {/* Show empty state if no documents */}
                  {!franchiseData.listing_documents?.length &&
                    (!isEditingFranchise || newListingDocs.length === 0) && (
                      <p className="text-gray-500 text-sm">
                        Belum ada dokumen listing
                      </p>
                    )}
                </div>

                {/* Listing Highlights */}
                <div>
                  <Label className="text-xs text-gray-500 block mb-2">
                    Keunggulan
                  </Label>

                  {/* Existing highlights */}
                  {editedHighlights && editedHighlights.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {editedHighlights.map((highlight, index) => {
                        const isDeleted = deletedHighlightIds.includes(
                          highlight.id
                        );

                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-md transition-colors ${
                              isDeleted
                                ? "bg-red-50 border border-red-200 opacity-60"
                                : "bg-gray-50"
                            }`}
                          >
                            {isEditingFranchise ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Input
                                    value={highlight.title}
                                    onChange={(e) =>
                                      handleEditHighlight(
                                        index,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Judul keunggulan"
                                    disabled={isDeleted}
                                    className={`font-medium text-sm ${
                                      isDeleted ? "bg-gray-100" : ""
                                    }`}
                                  />
                                  {!isDeleted ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteExistingHighlight(
                                          highlight.id
                                        )
                                      }
                                      className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleRestoreDeletedHighlight(
                                          highlight.id
                                        )
                                      }
                                      className="ml-2 text-green-600 hover:text-green-800 hover:bg-green-50"
                                    >
                                      <span className="text-xs">Pulihkan</span>
                                    </Button>
                                  )}
                                </div>
                                <textarea
                                  value={highlight.content}
                                  onChange={(e) =>
                                    handleEditHighlight(
                                      index,
                                      "content",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Deskripsi keunggulan"
                                  disabled={isDeleted}
                                  rows={3}
                                  className={`w-full text-sm text-gray-600 border border-gray-300 rounded px-3 py-2 resize-none ${
                                    isDeleted ? "bg-gray-100" : ""
                                  }`}
                                />
                                {isDeleted && (
                                  <p className="text-xs text-red-500">
                                    Keunggulan ini akan dihapus setelah disimpan
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className={isDeleted ? "line-through" : ""}>
                                <h3 className="font-medium text-sm">
                                  {highlight.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {highlight.content}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* New highlights (in edit mode) */}
                  {isEditingFranchise && newHighlights.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <Label className="text-xs text-gray-600 block">
                        Keunggulan Baru (Belum Disimpan)
                      </Label>
                      {newHighlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="p-3 bg-yellow-50 border border-yellow-200 rounded-md"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-sm text-yellow-800">
                              {highlight.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveNewHighlight(index)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-yellow-700">
                            {highlight.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new highlight form (in edit mode) */}
                  {isEditingFranchise && (
                    <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <Label className="text-sm font-medium text-blue-800">
                        Tambah Keunggulan Baru
                      </Label>
                      <Input
                        value={newHighlightForm.title}
                        onChange={(e) =>
                          setNewHighlightForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Judul keunggulan"
                        className="text-sm"
                      />
                      <textarea
                        value={newHighlightForm.content}
                        onChange={(e) =>
                          setNewHighlightForm((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Deskripsi keunggulan"
                        rows={3}
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 resize-none"
                      />
                      <Button
                        onClick={handleAddNewHighlight}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Tambah Keunggulan
                      </Button>
                    </div>
                  )}

                  {/* Show empty state if no highlights */}
                  {!editedHighlights?.length &&
                    (!isEditingFranchise || newHighlights.length === 0) && (
                      <p className="text-gray-500 text-sm">
                        Belum ada keunggulan
                      </p>
                    )}
                </div>
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
        </div>
      </div>
    </FranchisorLayout>
  );
}

// Export the component with authentication
export default withAuth(FranchisorDocumentsPage, "FRANCHISOR");
