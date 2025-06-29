"use client";
import { Button } from "@/components/ui/button";
import withAuth from "@/lib/withAuth";
import { ArrowLeft, Bookmark } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useGetDetailFranchise } from "./_hooks/useGetDetailFranchise";

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

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">
          Error loading franchise details
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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-4 max-w-md mx-auto">
        {/* Franchise Image */}
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={franchise?.image || "/image/placeholder-franchise.jpg"}
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
            {franchise?.name || "Unknown Franchise"}
          </h2>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            Rp.{" "}
            {franchise?.price
              ? parseInt(franchise.price).toLocaleString("id-ID")
              : "0"}
          </p>
          <p className="text-sm text-gray-500">
            {franchise?.location || "Location not specified"}
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
                <p className="mb-2">
                  Konsep usaha{" "}
                  <span className="font-semibold">{franchise?.name}</span>{" "}
                  berpusat pada penjualan mitra serta kesuksesannya. Demi lebih
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
                franchise.listings_highlights.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border mb-4">
                    <div className="space-y-3 text-xs">
                      {franchise.listings_highlights.map((highlight) => (
                        <div key={highlight.id} className="space-y-1">
                          <div className="font-semibold">{highlight.title}</div>
                          <div className="text-gray-600">
                            • {highlight.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Business Model Chart */}
              <div className="bg-white p-4 rounded-lg border mb-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="font-semibold">Peralatan</div>
                    <div className="text-gray-600">
                      • {franchise?.equipment || "Peralatan standar industri"}
                    </div>

                    <div className="font-semibold">Bahan Material</div>
                    <div className="text-gray-600">
                      • {franchise?.materials || "Bahan berkualitas tinggi"}
                    </div>

                    <div className="font-semibold">Lokasi Penjualan</div>
                    <div className="text-gray-600">
                      • {franchise?.sales_location || "Lokasi strategis"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-semibold">Status Franchise</div>
                    <div className="text-gray-600">
                      • Status: {franchise?.status || "Tersedia"}
                    </div>

                    <div className="font-semibold">Franchisor</div>
                    <div className="text-gray-600">
                      • {franchise?.franchisor?.name || "Franchisor terpercaya"}
                    </div>

                    <div className="font-semibold">Lokasi</div>
                    <div className="text-gray-600">
                      • {franchise?.location || "Lokasi strategis"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-orange-500 text-sm cursor-pointer">
                Baca proposal selengkapnya...
              </div>
            </div>
          )}

          {activeTab === "syarat" && (
            <div>
              <h3 className="font-semibold mb-3">Persyaratan</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lokasi penjualan:</span>
                  <span>{franchise?.sales_location || "Belum ditentukan"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alat:</span>
                  <span>{franchise?.equipment || "Disediakan Franchisor"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bahan:</span>
                  <span>{franchise?.materials || "Disediakan Franchisor"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span>{franchise?.status || "Tersedia"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Franchisor:</span>
                  <span>{franchise?.franchisor?.name || "Tidak tersedia"}</span>
                </div>

                {/* Documents */}
                {franchise?.listing_documents &&
                  franchise.listing_documents.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Dokumen Pendukung:</h4>
                      <div className="space-y-2">
                        {franchise.listing_documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex justify-between items-center text-xs"
                          >
                            <span className="text-gray-600">{doc.type}:</span>
                            <span className="text-blue-500">{doc.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Lainnya:</span>
                  <span className="text-orange-500 cursor-pointer">
                    Baca proposal selengkapnya...
                  </span>
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
                      Rp.{" "}
                      {franchise?.price
                        ? parseInt(franchise.price).toLocaleString("id-ID")
                        : "0"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                      <div className="font-semibold">
                        Dokumen Keuangan Tersedia:
                      </div>
                      <div className="text-gray-600">
                        • Laporan Keuangan:{" "}
                        {franchise?.financial_statement || "Tersedia"}
                      </div>
                      <div className="text-gray-600">
                        • Dokumen Kepemilikan:{" "}
                        {franchise?.ownership_document || "Tersedia"}
                      </div>
                      <div className="text-gray-600">
                        • Proposal Bisnis: {franchise?.proposal || "Tersedia"}
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 pl-3">
                      <div className="font-semibold">Detail Franchise:</div>
                      <div className="text-gray-600">
                        • Status: {franchise?.status}
                      </div>
                      <div className="text-gray-600">
                        • Lokasi: {franchise?.location}
                      </div>
                      <div className="text-gray-600">
                        • Peralatan: {franchise?.equipment}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-orange-500 text-sm cursor-pointer mt-3">
                Baca proposal selengkapnya...
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
          >
            Ajukan Modal
          </Button>
          <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
            Beli Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(FranchiseDetail, "FRANCHISEE");
