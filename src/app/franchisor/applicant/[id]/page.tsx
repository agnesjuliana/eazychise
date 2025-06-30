"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import withAuth from "@/lib/withAuth";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  FileText,
  Phone,
  MapPin,
  CreditCard,
  Download,
  Store,
  DollarSign,
  Package,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PurchaseDetail {
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
    role: string;
  };
  franchise: {
    id: string;
    franchisor_id: string;
    name: string;
    price: number;
    image: string;
    location: string;
    status: string;
    equipment: string;
    materials: string;
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

function ApplicantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<"ACCEPTED" | "REJECTED" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/franchisor/franchises/purchase/${params.id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch purchase detail");
        }

        setPurchase(data.data);
      } catch (error) {
        console.error("Error fetching purchase detail:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch purchase detail"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleActionClick = (status: "ACCEPTED" | "REJECTED") => {
    setPendingAction(status);
    setShowConfirmDialog(true);
  };

  const updatePurchaseStatus = async () => {
    if (!pendingAction) return;

    try {
      setUpdating(true);
      const response = await fetch(
        `/api/franchisor/franchises/purchase/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: pendingAction }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      // Update local state
      setPurchase((prev) =>
        prev ? { ...prev, confirmation_status: pendingAction } : null
      );

      // Close confirmation dialog and show success dialog
      setShowConfirmDialog(false);
      
      // Set success message
      const message =
        pendingAction === "ACCEPTED"
          ? "Franchisee berhasil disetujui! Mereka akan mendapat notifikasi dan dapat melanjutkan ke pembayaran."
          : "Aplikasi franchisee berhasil ditolak. Mereka akan mendapat notifikasi penolakan.";
      
      setSuccessMessage(message);
      setShowSuccessDialog(true);

    } catch (error) {
      console.error("Error updating status:", error);
      setError(error instanceof Error ? error.message : "Failed to update status");
      setShowConfirmDialog(false);
    } finally {
      setUpdating(false);
      setPendingAction(null);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Redirect after dialog is closed
    setTimeout(() => {
      router.push("/franchisor/applicant");
    }, 500);
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <FranchisorLayout>
        <div className="relative">
          <HeaderPage title="Detail Applicant" />
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-1/2 -translate-y-14 text-white z-10"
          >
            <ArrowLeft size={30} />
          </button>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF5A5A]"></div>
        </div>
      </FranchisorLayout>
    );
  }

  if (error || !purchase) {
    return (
      <FranchisorLayout>
        <div className="relative">
          <HeaderPage title="Detail Applicant" />
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-1/2 -translate-y-14 text-white z-10"
          >
            <ArrowLeft size={30} />
          </button>
        </div>
        <div className="text-center py-12 px-6">
          <div className="text-red-500 mb-2">Error</div>
          <p className="text-gray-500 text-sm">
            {error || "Data tidak ditemukan"}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-[#EF5A5A] text-white rounded-lg text-sm"
          >
            Kembali
          </button>
        </div>
      </FranchisorLayout>
    );
  }

  return (
    <FranchisorLayout>
      {/* Header */}
      <div className="relative">
        <HeaderPage title="Detail Applicant" />
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-1/2 -translate-y-14 text-white z-10"
        >
          <ArrowLeft size={30} />
        </button>
      </div>

      {/* Body */}
      <main className="p-6 space-y-6">
        {/* Status Banner */}
        <div
          className={`p-4 rounded-xl border-l-4 ${
            purchase.confirmation_status === "WAITING"
              ? "bg-yellow-50 border-yellow-400"
              : purchase.confirmation_status === "ACCEPTED"
              ? "bg-green-50 border-green-400"
              : "bg-red-50 border-red-400"
          }`}
        >
          <div className="flex items-center space-x-2">
            {purchase.confirmation_status === "WAITING" && (
              <Clock className="w-5 h-5 text-yellow-600" />
            )}
            {purchase.confirmation_status === "ACCEPTED" && (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            )}
            {purchase.confirmation_status === "REJECTED" && (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <div>
              <p
                className={`font-medium ${
                  purchase.confirmation_status === "WAITING"
                    ? "text-yellow-800"
                    : purchase.confirmation_status === "ACCEPTED"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                Status Aplikasi Franchisee:{" "}
                {purchase.confirmation_status === "WAITING"
                  ? "Menunggu Persetujuan"
                  : purchase.confirmation_status === "ACCEPTED"
                  ? "Franchisee Disetujui"
                  : "Franchisee Ditolak"}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {purchase.confirmation_status === "WAITING"
                  ? "Aplikasi franchisee sedang menunggu review dari Anda"
                  : purchase.confirmation_status === "ACCEPTED"
                  ? "Franchisee telah disetujui dan dapat melanjutkan ke pembayaran"
                  : "Aplikasi franchisee telah ditolak"}
              </p>
            </div>
          </div>
        </div>
        {/* Franchise Information */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Store className="w-5 h-5 mr-2 text-[#EF5A5A]" />
            Informasi Franchise
          </h3>

          <div className="mb-4">
            <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
              <Image
                src={purchase.franchise.image}
                alt={purchase.franchise.name}
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              {purchase.franchise.name}
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <DetailField
              label="Harga Franchise"
              value={`Rp ${Number(purchase.franchise.price).toLocaleString(
                "id-ID"
              )}`}
              icon={<DollarSign className="w-4 h-4" />}
            />
            <DetailField
              label="Lokasi"
              value={purchase.franchise.location}
              icon={<MapPin className="w-4 h-4" />}
            />
            <DetailField
              label="Equipment"
              value={purchase.franchise.equipment}
              icon={<Settings className="w-4 h-4" />}
            />
            <DetailField
              label="Materials"
              value={purchase.franchise.materials}
              icon={<Package className="w-4 h-4" />}
            />
          </div>
        </div>{" "}
        {/* User Info */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-[#EF5A5A]" />
            Informasi Franchisee (Pembeli)
          </h3>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {purchase.user.profile_image ? (
                <Image
                  src={purchase.user.profile_image}
                  alt={purchase.user.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold">{purchase.user.name}</h4>
              <p className="text-sm text-gray-500">{purchase.user.email}</p>
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-1 inline-block">
                Role: Franchisee
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Tipe Pembelian:{" "}
                {purchase.purchase_type === "FUNDED"
                  ? "Dengan Pendanaan"
                  : "Pembelian Langsung"}
              </div>
            </div>
          </div>

          {purchase.funding_request && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-4">
                <h5 className="font-semibold text-blue-800 mb-2">
                  Data Pendaftaran Franchisee
                </h5>
                <p className="text-sm text-blue-700">
                  Franchisee ini telah terdaftar dengan status WAITING dan
                  mengajukan pembelian franchise dengan data berikut:
                </p>
              </div>

              <DetailField
                label="Alamat Tempat Tinggal"
                value={purchase.funding_request.address}
                icon={<MapPin className="w-4 h-4" />}
              />
              <DetailField
                label="No Telepon"
                value={purchase.funding_request.phone_number}
                icon={<Phone className="w-4 h-4" />}
              />
              <DetailField
                label="NPWP"
                value={purchase.funding_request.npwp}
                icon={<CreditCard className="w-4 h-4" />}
              />
              <DetailField
                label="Alamat Lokasi Franchise Yang Diinginkan"
                value={purchase.funding_request.franchise_address}
                icon={<MapPin className="w-4 h-4" />}
              />

              {/* Document Downloads */}
              <div className="space-y-3 mt-6">
                <h4 className="font-semibold text-sm flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Dokumen Pendukung Franchisee
                </h4>

                <DocumentDownload
                  label="Foto KTP Franchisee"
                  filename="KTP_Franchisee.jpg"
                  onDownload={() =>
                    downloadFile(
                      purchase.funding_request!.ktp,
                      "KTP_Franchisee.jpg"
                    )
                  }
                />

                <DocumentDownload
                  label="Foto Diri Franchisee"
                  filename="Foto_Diri_Franchisee.jpg"
                  onDownload={() =>
                    downloadFile(
                      purchase.funding_request!.foto_diri,
                      "Foto_Diri_Franchisee.jpg"
                    )
                  }
                />

                <DocumentDownload
                  label="Foto Lokasi Franchise Yang Diinginkan"
                  filename="Foto_Lokasi_Franchise.jpg"
                  onDownload={() =>
                    downloadFile(
                      purchase.funding_request!.foto_lokasi,
                      "Foto_Lokasi_Franchise.jpg"
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
        {/* Action Buttons */}
        {purchase.confirmation_status === "WAITING" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Keputusan Persetujuan Franchisee
              </h3>
              <p className="text-sm text-gray-600">
                Setujui atau tolak aplikasi franchise dari{" "}
                <span className="font-medium">{purchase.user.name}</span>
              </p>
            </div>

            <div className="space-y-3">
              {/* Accept Button */}
              <Button
                className="w-full bg-green-600 text-white hover:bg-green-700 font-medium py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleActionClick("ACCEPTED")}
                disabled={updating}
              >
                {updating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Memproses Persetujuan...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 mr-3" />
                    Setujui Franchisee
                  </div>
                )}
              </Button>

              {/* Reject Button */}
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-600 hover:bg-red-50 hover:border-red-700 font-medium py-4 text-base border-2 transition-all duration-200"
                onClick={() => handleActionClick("REJECTED")}
                disabled={updating}
              >
                {updating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-3"></div>
                    Memproses Penolakan...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <XCircle className="w-5 h-5 mr-3" />
                    Tolak Franchisee
                  </div>
                )}
              </Button>
            </div>

            {/* Warning */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800 text-center font-medium">
                ⚠️ Keputusan ini bersifat final dan akan langsung
                dinotifikasikan ke franchisee
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === "ACCEPTED" ? "Konfirmasi Persetujuan" : "Konfirmasi Penolakan"}
            </DialogTitle>
            <DialogDescription className="text-left">
              Apakah Anda yakin ingin{" "}
              <span className="font-semibold">
                {pendingAction === "ACCEPTED" ? "menyetujui" : "menolak"}
              </span>{" "}
              aplikasi franchisee dari{" "}
              <span className="font-semibold">{purchase?.user.name}</span>?
              <br />
              <br />
              <span className="text-orange-600 font-medium">
                ⚠️ Keputusan ini bersifat final dan akan langsung dinotifikasikan ke franchisee.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={updating}
            >
              Batal
            </Button>
            <Button
              onClick={updatePurchaseStatus}
              disabled={updating}
              className={
                pendingAction === "ACCEPTED"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {updating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {pendingAction === "ACCEPTED" ? "Menyetujui..." : "Menolak..."}
                </div>
              ) : (
                <div className="flex items-center">
                  {pendingAction === "ACCEPTED" ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  {pendingAction === "ACCEPTED" ? "Ya, Setujui" : "Ya, Tolak"}
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={handleSuccessDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
              Berhasil!
            </DialogTitle>
            <DialogDescription className="text-left">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessDialogClose} className="bg-green-600 hover:bg-green-700">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FranchisorLayout>
  );
}

function DetailField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <Label className="font-semibold text-sm flex items-center mb-1">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Label>
      <Input
        readOnly
        value={value}
        className="bg-[#F7F7F7] text-[#6E7E9D] text-sm border-gray-200"
      />
    </div>
  );
}

function DocumentDownload({
  label,
  filename,
  onDownload,
}: {
  label: string;
  filename: string;
  onDownload: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500">{filename}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onDownload}
        className="text-[#EF5A5A] border-[#EF5A5A] hover:bg-red-50"
      >
        <Download className="w-4 h-4 mr-1" />
        Unduh
      </Button>
    </div>
  );
}

export default withAuth(ApplicantDetailPage, "FRANCHISOR");
