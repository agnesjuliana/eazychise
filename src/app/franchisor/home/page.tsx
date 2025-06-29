"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import withAuth from "@/lib/withAuth";
import Image from "next/image";
import { useFranchisorFranchise, useFranchisorPurchases, useFranchisorStats } from "./_hooks/useGetFranchisorData";
import { useMemo } from "react";
import { RefreshCw, AlertCircle, TrendingUp, Users, CheckCircle, Clock, XCircle } from "lucide-react";

const formatRupiah = (price: string | number): string => {
  const numPrice =
    typeof price === "string" ? parseFloat(price.replace(/[^\d]/g, "")) : price;

  // Check if it's a valid number
  if (isNaN(numPrice)) return price.toString();

  // Format with thousand separators
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

function HomeFranchisorPage() {
  const {
    data: franchiseData,
    isLoading: isFranchiseLoading,
    isError: isFranchiseError,
    error: franchiseError,
    refetch: refetchFranchise,
  } = useFranchisorFranchise();

  const {
    data: purchasesData,
    isLoading: isPurchasesLoading,
    isError: isPurchasesError,
    error: purchasesError,
    refetch: refetchPurchases,
  } = useFranchisorPurchases();

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats,
  } = useFranchisorStats();

  // Calculate comprehensive sales data
  const salesData = useMemo(() => {
    if (!purchasesData) return { 
      totalSold: 0, 
      totalRevenue: 0, 
      pendingPurchases: 0, 
      totalPurchases: 0,
      conversionRate: 0 
    };

    const paidPurchases = purchasesData.filter(
      (purchase) => purchase.payment_status === "paid"
    );
    
    const pendingPurchases = purchasesData.filter(
      (purchase) => purchase.payment_status === "pending"
    );

    const totalSold = paidPurchases.length;
    const totalPurchases = purchasesData.length;
    const pendingCount = pendingPurchases.length;
    const conversionRate = totalPurchases > 0 ? (totalSold / totalPurchases) * 100 : 0;
    
    const totalRevenue = paidPurchases.reduce((sum, purchase) => {
      // Assuming the franchise price from franchiseData
      if (franchiseData && franchiseData.length > 0 && franchiseData[0].price) {
        const price = parseFloat(franchiseData[0].price.replace(/[^\d]/g, ""));
        return sum + price;
      }
      return sum;
    }, 0);

    return { 
      totalSold, 
      totalRevenue, 
      pendingPurchases: pendingCount, 
      totalPurchases,
      conversionRate 
    };
  }, [purchasesData, franchiseData]);

  // Get first franchise for display
  const displayFranchise = franchiseData && franchiseData.length > 0 ? franchiseData[0] : null;

  return (
    <FranchisorLayout className="overflow-x-hidden">
      {/* Header dengan card overlap di bawahnya */}
      <div className="relative">
        <HeaderPage title="Dashboard Franchisor" />
        {/* Card Accepted overlap di bawah header */}
        <div className="absolute left-0 right-0 -bottom-17 z-20 flex justify-center">
          <div className="w-[90%] max-w-xl">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 overflow-hidden shadow-lg">
              <CardContent className="relative p-0 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light">Franchise Diterima</p>
                    {isStatsLoading ? (
                      <div className="h-10 bg-white/20 rounded animate-pulse mt-2"></div>
                    ) : isStatsError ? (
                      <p className="text-3xl font-bold mt-2">Error</p>
                    ) : (
                      <p className="text-4xl font-bold mt-2">{statsData?.accepted || 0}</p>
                    )}
                  </div>
                  <CheckCircle className="w-8 h-8 opacity-80" />
                </div>
                <Image
                  src="/image/cloudWhite.png"
                  alt="Cloud Element"
                  width={32}
                  height={21}
                  className="absolute -bottom-1 -right-1"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pt-8">
        {/* Subtitle with Refresh */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white text-sm text-center flex-1">
            Mulai Bisnismu Tanpa Overthinking!
          </p>
          {(isFranchiseError || isPurchasesError || isStatsError) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isFranchiseError) refetchFranchise();
                if (isPurchasesError) refetchPurchases();
                if (isStatsError) refetchStats();
              }}
              className="text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Error Alert */}
        {(isFranchiseError || isPurchasesError || isStatsError) && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-600 text-sm font-medium">
                    Terjadi kesalahan saat memuat data
                  </p>
                  <p className="text-red-500 text-xs mt-1">
                    {franchiseError?.message || purchasesError?.message || statsError?.message}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="ml-auto text-red-600 border-red-200 hover:bg-red-100"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Muat Ulang
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards - Waiting & Rejected (Side by Side) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card Waiting */}
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 overflow-hidden">
            <CardContent className="relative p-0 h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-light">Menunggu</p>
                  {isStatsLoading ? (
                    <div className="h-8 bg-white/20 rounded animate-pulse mt-1"></div>
                  ) : isStatsError ? (
                    <p className="text-2xl font-bold mt-1">Error</p>
                  ) : (
                    <p className="text-3xl font-bold mt-1">{statsData?.waiting || 0}</p>
                  )}
                </div>
                <Clock className="w-5 h-5 opacity-80" />
              </div>
              <Image
                src="/image/cloudOrange.png"
                alt="Cloud Element"
                width={28.95}
                height={19.11}
                className="absolute -bottom-1 -right-1"
              />
            </CardContent>
          </Card>
          {/* Card Rejected */}
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 overflow-hidden">
            <CardContent className="relative p-0 h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-light">Ditolak</p>
                  {isStatsLoading ? (
                    <div className="h-8 bg-white/20 rounded animate-pulse mt-1"></div>
                  ) : isStatsError ? (
                    <p className="text-2xl font-bold mt-1">Error</p>
                  ) : (
                    <p className="text-3xl font-bold mt-1">{statsData?.rejected || 0}</p>
                  )}
                </div>
                <XCircle className="w-5 h-5 opacity-80" />
              </div>
              <Image
                src="/image/cloudWhite.png"
                alt="Cloud Element"
                width={28.95}
                height={19.11}
                className="absolute -bottom-1 -right-1"
              />
            </CardContent>
          </Card>
        </div>

        {/* Registered Franchise */}
        {isFranchiseLoading ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Franchise Terdaftar
            </h2>
            <Card className="p-0 overflow-hidden border-gray-200 animate-pulse">
              <div className="relative h-40 w-full bg-gray-200"></div>
              <CardContent className="px-4 pb-4">
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          </div>
        ) : isFranchiseError ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Franchise Terdaftar
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.reload();
                }}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Muat Ulang
              </Button>
            </div>
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600 text-sm">
                  Error loading franchise: {franchiseError?.message}
                </p>
              </div>
            </Card>
          </div>
        ) : displayFranchise ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Franchise Terdaftar
            </h2>
            <Card className="p-0 overflow-hidden border-gray-200">
              <div className="relative h-40 w-full">
                <Image
                  src={displayFranchise.image || "/image/home/template-picture-franchise-food.png"}
                  alt={`Image of ${displayFranchise.name}`}
                  fill
                  className="object-cover bg-gray-200"
                />
              </div>
              <CardContent className="px-4 pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">
                  {displayFranchise.name}
                </CardTitle>
                <CardDescription className="text-xs text-gray-600 mb-2">
                  {displayFranchise.location}
                </CardDescription>
                <CardDescription className="text-sm text-gray-600 mb-2">
                  Harga: {formatRupiah(displayFranchise.price)}
                </CardDescription>
                <CardDescription className="text-sm text-gray-600">
                  Status: <span className="capitalize">{displayFranchise.status}</span>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Franchise Terdaftar
            </h2>
            <Card className="p-4 border-gray-200">
              <p className="text-gray-600 text-sm text-center">
                Belum ada franchise yang terdaftar
              </p>
            </Card>
          </div>
        )}
      </div>
    </FranchisorLayout>
  );
}

export default withAuth(HomeFranchisorPage, "FRANCHISOR");
