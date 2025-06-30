"use client";
import AppLayout from "@/components/app-layout";
import withAuth from "@/lib/withAuth";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Key, use, useState } from "react";
import { toast } from "sonner";
import { useGetDetailFranchise } from ".././_hooks/useGetDetailFranchise";

function FranchiseDetail({
  params,
}: {
  params: Promise<{ franchiseId: string }>;
}) {
  const { franchiseId } = use(params);
  const { data, isLoading, isError } = useGetDetailFranchise(franchiseId);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"tentang" | "syarat" | "keuangan">(
    "tentang"
  );
  const [expandedDocTypes, setExpandedDocTypes] = useState<{
    [key: string]: boolean;
  }>({});

  const handleGoBack = () => {
    router.back();
  };

  // Helper function to safely render data with fallback
  const renderDataWithFallback = (
    data: string | undefined | null,
    fallback: string,
    isRequired = false
  ) => {
    if (!data || typeof data !== "string" || data.trim() === "") {
      return (
        <span className={isRequired ? "text-red-500 " : "text-gray-400 "}>
          {isRequired ? "Data tidak tersedia" : fallback}
        </span>
      );
    }
    return data;
  };

  // Helper function to format price safely
  const formatPrice = (price: string | undefined | null) => {
    if (!price || typeof price !== "string" || price.trim() === "") {
      return <span className="text-red-500 ">Harga tidak tersedia</span>;
    }
    try {
      const numPrice = parseInt(price);
      if (isNaN(numPrice)) {
        return <span className="text-red-500 ">Format harga tidak valid</span>;
      }
      return `Rp. ${numPrice.toLocaleString("id-ID")}`;
    } catch {
      return <span className="text-red-500 ">Error memformat harga</span>;
    }
  };

  // Helper function to handle PDF document opening
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

  const toggleDocumentType = (docType: string) => {
    setExpandedDocTypes((prev) => ({
      ...prev,
      [docType]: !prev[docType],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 max-w-md mx-auto">
          {/* Loading Image Skeleton */}
          <div className="relative w-full h-48 mb-4 rounded-lg bg-gray-200 animate-pulse">
            <div className="absolute top-3 left-3 w-9 h-9 bg-gray-300 rounded-full"></div>
            <div className="absolute top-3 right-3 w-9 h-9 bg-gray-300 rounded-full"></div>
          </div>

          {/* Loading Franchise Info */}
          <div className="mb-4 space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
          </div>

          {/* Loading Tabs */}
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
            <div className="flex-1 h-8 bg-gray-200 rounded-md animate-pulse mx-1"></div>
            <div className="flex-1 h-8 bg-gray-200 rounded-md animate-pulse mx-1"></div>
            <div className="flex-1 h-8 bg-gray-200 rounded-md animate-pulse mx-1"></div>
          </div>

          {/* Loading Content */}
          <div className="space-y-4 mb-6">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6"></div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Buttons */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gagal Memuat Data Franchise
          </h3>
          <p className="text-gray-600 mb-4">
            Terjadi kesalahan saat memuat detail franchise. Silakan coba lagi.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // The data is the franchise object directly
  const franchise = data;

  // Additional check for franchise data
  if (!franchise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">
          <div>Franchise data not found</div>
          <div className="text-sm mt-2">
            Debug: {JSON.stringify(data, null, 2)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-4 max-w-md mx-auto">
        {/* Franchise Image */}
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={`${franchise?.image}` || "/image/placeholder-franchise.jpg"}
            alt={franchise?.name || "Franchise"}
            fill
            className="object-cover"
          />
          {/* Back Arrow */}
          <button
            className="absolute top-3 left-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white/90 transition-colors"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          {/* Bookmark Icon */}
          <button className="absolute top-3 right-3 p-2">
            <Bookmark className="w-6 h-6 text-orange-500 fill-orange-500" />
          </button>
        </div>

        {/* Franchise Info */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">
            {renderDataWithFallback(
              franchise?.name,
              "Nama franchise tidak tersedia",
              true
            )}
          </h2>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            {formatPrice(franchise?.price)}
          </p>
          <p className="text-sm text-gray-500">
            {renderDataWithFallback(
              franchise?.location,
              "Lokasi tidak ditentukan"
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "tentang"
                ? "bg-white text-red-500 shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("tentang")}
          >
            Tentang
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "syarat"
                ? "bg-white text-red-500 shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("syarat")}
          >
            Syarat
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "keuangan"
                ? "bg-white text-red-500 shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("keuangan")}
          >
            Keuangan
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-6">
          {activeTab === "tentang" && (
            <div>
              <h3 className="font-semibold mb-3">Deskripsi singkat</h3>
              <div className="text-sm text-gray-700 leading-relaxed mb-4">
                <p className="mb-2 text-justify">
                  Konsep usaha{" "}
                  <span className="font-semibold">{data?.name}</span> berpusat
                  pada penjualan mitra serta kesuksesannya. Demi lebih
                  mempermudah tersebut, kami memberikan pelayanan dan mutu
                  terbaik. Dari regi desain yang berganti hampir setiap bulan
                  lalu dari dari segi management yang berpengalaman dibidangnya
                  serta support maksimal yang sangat mudah, ini bukan hanya
                  tentang usaha kami tetapi!{" "}
                  <span className="font-semibold">Tentang Kamu</span>
                </p>
              </div>

              {/* Listing Highlights */}
              {franchise?.listings_highlights &&
              franchise.listings_highlights.length > 0 ? (
                <div className="bg-white p-4 rounded-lg border mb-4">
                  <div className="space-y-3 text-xs">
                    {franchise.listings_highlights.map(
                      (highlight: {
                        id: Key | null | undefined;
                        title: string | null | undefined;
                        content: string | null | undefined;
                      }) => (
                        <div key={highlight.id} className="space-y-1">
                          <div className="font-semibold">
                            {renderDataWithFallback(
                              highlight.title,
                              "Judul tidak tersedia"
                            )}
                          </div>
                          <div className="text-gray-600">
                            •{" "}
                            {renderDataWithFallback(
                              highlight.content,
                              "Konten tidak tersedia"
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg border mb-4">
                  <div className="text-xs text-gray-400  text-center py-4">
                    Tidak ada highlight yang tersedia untuk franchise ini
                  </div>
                </div>
              )}

              {/* Business Model Chart */}
              <div className="bg-white p-4 rounded-lg border mb-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="font-semibold">Peralatan</div>
                    <div className="text-gray-600">
                      •{" "}
                      {renderDataWithFallback(
                        franchise?.equipment,
                        "Informasi peralatan tidak tersedia"
                      )}
                    </div>

                    <div className="font-semibold">Bahan Material</div>
                    <div className="text-gray-600">
                      •{" "}
                      {renderDataWithFallback(
                        franchise?.materials,
                        "Informasi bahan tidak tersedia"
                      )}
                    </div>

                    <div className="font-semibold">Lokasi Penjualan</div>
                    <div className="text-gray-600">
                      •{" "}
                      {renderDataWithFallback(
                        franchise?.sales_location,
                        "Lokasi penjualan tidak ditentukan"
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-semibold">Status Franchise</div>
                    <div className="text-gray-600">
                      • Status:{" "}
                      {renderDataWithFallback(
                        franchise?.status,
                        "Status tidak diketahui"
                      )}
                    </div>

                    <div className="font-semibold">Franchisor</div>
                    <div className="text-gray-600">
                      •{" "}
                      {renderDataWithFallback(
                        franchise?.franchisor?.name,
                        "Informasi franchisor tidak tersedia"
                      )}
                    </div>

                    <div className="font-semibold">Lokasi</div>
                    <div className="text-gray-600">
                      •{" "}
                      {renderDataWithFallback(
                        franchise?.location,
                        "Lokasi tidak ditentukan"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-orange-500 text-sm cursor-pointer">
                <button
                  onClick={() => handleOpenDocument(franchise?.proposal || "")}
                  className="flex items-center text-orange-500 hover:underline"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Baca proposal selengkapnya...</span>
                  <Eye className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "syarat" && (
            <div>
              <h3 className="font-semibold mb-3">Persyaratan</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lokasi penjualan:</span>
                  <span>
                    {renderDataWithFallback(
                      franchise?.sales_location,
                      "Belum ditentukan"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alat:</span>
                  <span>
                    {renderDataWithFallback(
                      franchise?.equipment,
                      "Informasi tidak tersedia"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bahan:</span>
                  <span>
                    {renderDataWithFallback(
                      franchise?.materials,
                      "Informasi tidak tersedia"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span>
                    {renderDataWithFallback(
                      franchise?.status,
                      "Status tidak diketahui"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Franchisor:</span>
                  <span>
                    {renderDataWithFallback(
                      franchise?.franchisor?.name,
                      "Informasi tidak tersedia"
                    )}
                  </span>
                </div>

                {/* Documents */}
                {franchise?.listing_documents &&
                franchise.listing_documents.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-3">Dokumen Pendukung:</h4>

                    {/* Group documents by type */}
                    {(() => {
                      type DocumentType = {
                        id: Key | null | undefined;
                        type: string | null | undefined;
                        name: string | null | undefined;
                        path: string | null | undefined;
                      };

                      const docsByType = franchise.listing_documents.reduce(
                        (
                          acc: { [key: string]: DocumentType[] },
                          doc: DocumentType
                        ) => {
                          const type = doc.type || "OTHER";
                          if (!acc[type]) acc[type] = [];
                          acc[type].push(doc);
                          return acc;
                        },
                        {}
                      );

                      return Object.entries(docsByType).map(
                        ([docType, docs]) => (
                          <div key={docType} className="mb-3">
                            {/* Document Type Header */}
                            <button
                              onClick={() => toggleDocumentType(docType)}
                              className="flex items-center justify-between w-full text-left py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <span className="font-medium text-gray-700">
                                {docType}: ({docs.length})
                              </span>
                              {expandedDocTypes[docType] ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>

                            {/* Document List */}
                            {expandedDocTypes[docType] && (
                              <div className="mt-2 pl-3 space-y-2 border-l-2 border-gray-200">
                                {docs.map((doc: DocumentType) => (
                                  <div
                                    key={doc.id}
                                    className="flex justify-between items-center text-sm py-2 px-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                                  >
                                    <button
                                      onClick={() =>
                                        handleOpenDocument(doc.path || "")
                                      }
                                      className="flex items-center text-blue-500 hover:underline w-full text-left"
                                    >
                                      <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                                      <span className="break-words overflow-hidden">
                                        {renderDataWithFallback(
                                          doc.name ||
                                            getDocumentDisplayName(
                                              doc.path || ""
                                            ),
                                          "Nama dokumen tidak tersedia"
                                        )}
                                      </span>
                                      <Eye className="h-4 w-4 ml-2 flex-shrink-0" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      );
                    })()}
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-400  text-center">
                      Tidak ada dokumen pendukung yang tersedia
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Lainnya:</span>
                  <button
                    onClick={() =>
                      handleOpenDocument(franchise?.proposal || "")
                    }
                    className="flex items-center text-orange-500 hover:underline"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Baca proposal selengkapnya...</span>
                    <Eye className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "keuangan" && (
            <div>
              <h3 className="font-semibold mb-3">
                Informasi Keuangan Franchise
              </h3>
              <div className="bg-white p-4 rounded-lg border mb-4">
                <div className="text-xs leading-relaxed">
                  <div className="mb-4">
                    <div className="font-semibold text-lg text-center mb-2">
                      Total Investasi
                    </div>
                    <div className="text-center text-2xl font-bold text-green-600">
                      {formatPrice(franchise?.price)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-4">
                    <div className="border-l-4 border-blue-500 pl-3 ">
                      <div className="font-semibold">
                        Dokumen Keuangan Tersedia:
                      </div>
                      <div className="space-y-2 mt-2">
                        <button
                          onClick={() =>
                            handleOpenDocument(
                              franchise?.financial_statement || ""
                            )
                          }
                          className="flex items-start text-blue-600 hover:underline w-full text-left"
                        >
                          <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="break-words overflow-hidden">
                            Laporan Keuangan (
                            {getDocumentDisplayName(
                              franchise?.financial_statement || ""
                            )}
                            )
                          </span>
                          <Eye className="h-4 w-4 ml-2 flex-shrink-0" />
                        </button>
                        <button
                          onClick={() =>
                            handleOpenDocument(
                              franchise?.ownership_document || ""
                            )
                          }
                          className="flex items-start text-blue-600 hover:underline w-full text-left"
                        >
                          <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="break-words overflow-hidden">
                            Dokumen Kepemilikan (
                            {getDocumentDisplayName(
                              franchise?.ownership_document || ""
                            )}
                            )
                          </span>
                          <Eye className="h-4 w-4 ml-2 flex-shrink-0" />
                        </button>
                        <button
                          onClick={() =>
                            handleOpenDocument(franchise?.proposal || "")
                          }
                          className="flex items-start text-blue-600 hover:underline w-full text-left"
                        >
                          <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="break-words overflow-hidden">
                            Proposal Bisnis (
                            {getDocumentDisplayName(franchise?.proposal || "")})
                          </span>
                          <Eye className="h-4 w-4 ml-2 flex-shrink-0" />
                        </button>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 pl-3">
                      <div className="font-semibold">Detail Franchise:</div>
                      <div className="text-gray-600">
                        • Status:{" "}
                        {renderDataWithFallback(
                          franchise?.status,
                          "Status tidak diketahui"
                        )}
                      </div>
                      <div className="text-gray-600">
                        • Lokasi:{" "}
                        {renderDataWithFallback(
                          franchise?.location,
                          "Lokasi tidak ditentukan"
                        )}
                      </div>
                      <div className="text-gray-600">
                        • Peralatan:{" "}
                        {renderDataWithFallback(
                          franchise?.equipment,
                          "Informasi tidak tersedia"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-orange-500 text-sm cursor-pointer mt-3">
                <button
                  onClick={() => handleOpenDocument(franchise?.proposal || "")}
                  className="flex items-center text-orange-500 hover:underline"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Baca proposal selengkapnya...</span>
                  <Eye className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default withAuth(FranchiseDetail, "FRANCHISEE");
