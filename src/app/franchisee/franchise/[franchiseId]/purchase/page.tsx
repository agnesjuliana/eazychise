"use client";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import withAuth from "@/lib/withAuth";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useGetDetailFranchise } from "../_hooks/useGetDetailFranchise";
import { usePurchaseFranchise } from "./_hooks/usePurchaseFranchise";

function PurchasePage({
  params,
}: {
  params: Promise<{ franchiseId: string }>;
}) {
  const { franchiseId } = use(params);
  const { data: franchise, isLoading } = useGetDetailFranchise(franchiseId);
  const { purchaseFranchise, isLoading: isPurchasing } = usePurchaseFranchise();
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const formatPrice = (price: string | undefined | null) => {
    if (!price || typeof price !== "string" || price.trim() === "") {
      return "Harga tidak tersedia";
    }
    try {
      const numericPrice = parseFloat(price.replace(/[^\d]/g, ""));
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericPrice);
    } catch {
      return price;
    }
  };

  const handlePayment = async () => {
    const success = await purchaseFranchise(franchiseId, {
      purchase_type: "PURCHASED",
      confirmation_status: "ACCEPTED",
      payment_status: "PAID",
      paid_at: new Date().toISOString(),
    });

    if (success) {
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    }
  };

  const handleSuccess = () => {
    setShowSuccessModal(false);
    router.push("/franchisee/franchise");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-red-400 to-red-500">
        {/* Header */}
        <div className="relative p-4 pb-8">
          <button
            onClick={handleGoBack}
            className="absolute left-4 top-4 text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-center text-white text-xl font-semibold mt-2">
            Pembayaran
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-t-3xl flex-1 p-6 min-h-screen">
          {/* Payment Method Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Metode Pembayaran
              </h2>
              <span className="text-red-500 text-sm">Lihat Semua</span>
            </div>

            {/* BCA Payment Method */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BCA</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Bank Central Asia</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Ringkasan Pembayaran
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tagihan</span>
                <span className="font-medium">
                  {formatPrice(franchise?.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Bottom Section */}
          <div className="mt-auto pt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total Bayar</span>
              <span className="text-xl font-bold text-red-500">
                {formatPrice(franchise?.price)}
              </span>
            </div>

            <Button
              onClick={() => setShowConfirmModal(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-lg font-medium"
              disabled={isPurchasing}
            >
              Bayar
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin melakukan pembayaran sebesar{" "}
              {formatPrice(franchise?.price)} untuk franchise{" "}
              {franchise?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              disabled={isPurchasing}
            >
              Batal
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isPurchasing}
              className="bg-red-500 hover:bg-red-600"
            >
              {isPurchasing ? "Memproses..." : "Ya, Bayar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[425px] text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl mb-2">
              Pembayaran berhasil!
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleSuccess}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Lanjut
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

export default withAuth(PurchasePage, "FRANCHISEE");