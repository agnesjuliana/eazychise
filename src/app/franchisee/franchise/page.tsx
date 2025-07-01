"use client";
import AppLayout from "@/components/app-layout";
import HeaderPage from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { FranchiseCardSkeleton } from "@/components/ui/skeleton";
import withAuth from "@/lib/withAuth";
import { ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetOwnedFranchises,
  type FranchisePurchase,
} from "./_hooks/useGetOwnedFranchises";

function OwnedFranchisePage() {
  const {
    data: franchises,
    isLoading,
    isError,
  } = useGetOwnedFranchises({
    page: 1,
    limit: 50,
  });
  const router = useRouter();

  const handleFranchiseClick = (franchiseId: string) => {
    router.push(`/franchisee/franchise/${franchiseId}/owned-franchise-detail`);
  };

  const LoadingState = () => (
    <div className="px-4 py-6 space-y-4">
      {/* Loading skeleton for franchise count card */}
      <Card className="bg-warning text-warning-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-4 bg-white/30 rounded w-24 mb-2"></div>
              <div className="h-8 bg-white/30 rounded w-8"></div>
            </div>
            <div className="w-10 h-10 bg-white/30 rounded-full animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Loading skeleton for franchise list */}
      {Array.from({ length: 3 }, (_, index) => (
        <FranchiseCardSkeleton key={index} />
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="px-4 py-12 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-12 h-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Belum Ada Franchise
      </h3>
      <p className="text-muted-foreground text-sm">
        Anda belum memiliki franchise. Mulai jelajahi berbagai peluang franchise
        yang tersedia.
      </p>
    </div>
  );

  const FranchiseCountCard = () => (
    <Card className="bg-warning text-warning-foreground">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium mb-1">Franchise Saya</p>
            <p className="text-3xl font-bold">{franchises?.length || 0}</p>
          </div>
          <Image
            src="/image/cloudWhite.png"
            alt="Cloud"
            width={40}
            height={40}
            className="text-white"
          />
        </div>
      </CardContent>
    </Card>
  );

  const FranchiseItem = ({ franchise }: { franchise: FranchisePurchase }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => handleFranchiseClick(franchise.franchise_id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Franchise Image */}
          <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={franchise.franchise.image || "/image/dummy/burger_lokal.jpg"}
              alt={franchise.franchise.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/image/dummy/burger_lokal.jpg";
              }}
            />
          </div>

          {/* Franchise Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate mb-1">
              {franchise.franchise.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{franchise.franchise.location}</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-50 max-w-md mx-auto bg-background w-full">
        <HeaderPage title="OWNED FRANCHISE" />
      </div>
      <div style={{ height: "162px" }} className="w-full bg-background"></div>

      <div className="min-h-screen bg-background">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <div className="px-4 py-12 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gagal Memuat Data
            </h3>
            <p className="text-gray-600 text-sm">
              Terjadi kesalahan saat memuat data franchise. Silakan coba lagi.
            </p>
          </div>
        ) : !franchises || franchises.length === 0 ? (
          <>
            <div className="px-4 py-6">
              <FranchiseCountCard />
            </div>
            <EmptyState />
          </>
        ) : (
          <div className="px-4 py-6 space-y-4">
            {/* Franchise Count Card */}
            <FranchiseCountCard />

            {/* Franchise List */}
            <div className="space-y-3">
              {franchises.map((franchise) => (
                <FranchiseItem key={franchise.id} franchise={franchise} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default withAuth(OwnedFranchisePage, "FRANCHISEE");
