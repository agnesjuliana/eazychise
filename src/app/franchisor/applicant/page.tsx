"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import withAuth from "@/lib/withAuth";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Purchase {
  id: string;
  purchase_type: string;
  confirmation_status: "WAITING" | "ACCEPTED" | "REJECTED";
  payment_status: string;
  paid_at: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    profile_image: string | null;
    role: string; // Add role to show franchisee
  };
  funding_request: {
    id: string;
    confirmation_status: "WAITING" | "ACCEPTED" | "REJECTED";
    address: string;
    phone_number: string;
    npwp: string;
    franchise_address: string;
    ktp: string;
    foto_diri: string;
    foto_lokasi: string;
    mou_franchisor: string;
    mou_modal: string;
  } | null;
}

function ApplicantPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/franchisor/franchises/purchase");
      const data = await response.json();

      console.log("Fetched purchases:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch purchases");
      }

      // Filter only franchisee purchases
      const franchiseePurchases = (data.data || []).filter(
        (purchase: Purchase) => purchase.user.role === "FRANCHISEE"
      );

      setPurchases(franchiseePurchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch purchases"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "WAITING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "WAITING":
        return "Menunggu";
      case "ACCEPTED":
        return "Diterima";
      case "REJECTED":
        return "Ditolak";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "text-yellow-600 bg-yellow-50";
      case "ACCEPTED":
        return "text-green-600 bg-green-50";
      case "REJECTED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <FranchisorLayout>
      {/* Header */}
      <div className="relative">
        <HeaderPage title="Applicant" />
      </div>

      {/* Subtext */}
      <div className="px-6 pt-4">
        <h2 className="text-lg font-semibold">Aplikasi Franchisee</h2>
        <p className="text-xs text-[#6E7E9D]">
          Daftar franchisee yang mengajukan pembelian franchise Anda
        </p>

        {/* Statistics */}
        {!loading && purchases.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <div className="text-sm font-semibold text-yellow-700">
                {
                  purchases.filter((p) => p.confirmation_status === "WAITING")
                    .length
                }
              </div>
              <div className="text-xs text-yellow-600">Menunggu</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-sm font-semibold text-green-700">
                {
                  purchases.filter((p) => p.confirmation_status === "ACCEPTED")
                    .length
                }
              </div>
              <div className="text-xs text-green-600">Diterima</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-sm font-semibold text-red-700">
                {
                  purchases.filter((p) => p.confirmation_status === "REJECTED")
                    .length
                }
              </div>
              <div className="text-xs text-red-600">Ditolak</div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <main className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF5A5A]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">Error</div>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={fetchPurchases}
              className="mt-4 px-4 py-2 bg-[#EF5A5A] text-white rounded-lg text-sm"
            >
              Coba Lagi
            </button>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Belum ada franchisee yang mengajukan pembelian
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Franchisee yang mendaftar akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                onClick={() =>
                  router.push(`/franchisor/applicant/${purchase.id}`)
                }
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {purchase.user.profile_image ? (
                        <Image
                          src={purchase.user.profile_image}
                          alt={purchase.user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {purchase.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {purchase.user.email}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          Franchisee
                        </div>
                        <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          {purchase.purchase_type === "FUNDED"
                            ? "Pendanaan"
                            : "Pembelian"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                        purchase.confirmation_status
                      )}`}
                    >
                      {getStatusIcon(purchase.confirmation_status)}
                      <span>{getStatusText(purchase.confirmation_status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </FranchisorLayout>
  );
}

export default withAuth(ApplicantPage, "FRANCHISOR");
