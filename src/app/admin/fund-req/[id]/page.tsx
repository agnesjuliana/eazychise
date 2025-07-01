"use client";
import AdminLayout from "@/components/admin-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/usetoast";

// Type definition menggunakan ConfirmationStatus saja
type ConfirmationStatus = "REJECTED" | "WAITING" | "ACCEPTED" | "INTERVIEW";

interface FundingData {
  id: string;
  address: string;
  phone_number: string;
  npwp: string;
  franchise_address: string;
  ktp: string;
  foto_diri: string;
  foto_lokasi: string;
  mou_franchisor: string;
  mou_modal: string;
  confirmation_status: ConfirmationStatus;
  purchase: {
    user: {
      name: string;
      email: string;
    };
  };
}

function DetailFundingRequestPage() {
  const router = useRouter();
  const pathName = usePathname();
  const id = pathName.split("/").pop();

  const [funding, setFunding] = React.useState<FundingData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [actionStatus, setActionStatus] =
    React.useState<ConfirmationStatus | null>(null);
  const { showToast, ToastRenderer } = useToast();

  React.useEffect(() => {
    const fetchFunding = async () => {
      try {
        const res = await fetch(`/api/funding-request/${id}`);
        const data = await res.json();

        if (data.status) {
          const raw = data.data; // ✅ tambahkan ini
          const mapped: FundingData = {
            ...raw,
            confirmationStatus: raw.confirmation_status,
          }; // ✅ mapping snake_case → camelCase
          setFunding(data.data);
        } else {
          console.error("Failed to fetch funding data");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFunding();
  }, [id]);

  const downloadLink = (url: string, text: string) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded text-sm font-semibold text-center block"
    >
      {text}
    </a>
  );

  const handleAction = async (status: ConfirmationStatus) => {
    try {
      const payload = {
        status: status, // ✅ hanya untuk funding_request
      };

      const res = await fetch(`/api/funding-request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        showToast("Status berhasil diperbarui", "success");

        setFunding((prev) => prev && { ...prev, confirmation_status: status });
        setOpen(false);

        // ✅ Tambahkan query param agar AdminApprovePage bisa re-fetch
        router.replace("/admin/fund-req?updated=true");
      } else {
        showToast(data.message || "Gagal memperbarui status", "destructive");
        console.error("Server error:", data);
      }
    } catch (err) {
      showToast("Terjadi kesalahan saat memperbarui data", "destructive");
      console.error(err);
    }
  };

  // Helper function untuk menentukan status badge
  const getStatusBadge = (status: ConfirmationStatus) => {
    const statusConfig: Record<
      ConfirmationStatus,
      { label: string; color: string }
    > = {
      WAITING: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
      INTERVIEW: { label: "Interview", color: "bg-blue-100 text-blue-800" },
      ACCEPTED: { label: "Disetujui", color: "bg-green-100 text-green-800" },
      REJECTED: { label: "Ditolak", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Helper function untuk menentukan tombol yang tersedia
  const getAvailableActions = (currentStatus: ConfirmationStatus) => {
    const actionConfig: Record<
      ConfirmationStatus,
      Array<{ action: ConfirmationStatus; label: string; variant: string }>
    > = {
      WAITING: [
        { action: "INTERVIEW", label: "Proses Interview", variant: "default" },
        { action: "REJECTED", label: "Tolak", variant: "destructive" },
      ],
      INTERVIEW: [
        { action: "ACCEPTED", label: "Setujui", variant: "default" },
        { action: "REJECTED", label: "Tolak", variant: "destructive" },
      ],
      ACCEPTED: [],
      REJECTED: [
        { action: "INTERVIEW", label: "Proses Ulang", variant: "default" },
      ],
    };

    return actionConfig[currentStatus] || [];
  };

  // Helper function untuk mendapatkan label status dalam bahasa Indonesia
  const getStatusLabel = (status: ConfirmationStatus): string => {
    const statusLabels: Record<ConfirmationStatus, string> = {
      WAITING: "Menunggu",
      INTERVIEW: "Interview",
      ACCEPTED: "Disetujui",
      REJECTED: "Ditolak",
    };

    return statusLabels[status];
  };

  return (
    <>
      <AdminLayout>
        <HeaderPage title="Formulir Pendaftaran" />

        <div className="w-full px-4 mt-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 cursor-pointer"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Kembali
          </Button>
        </div>

        <div className="w-full px-4 mt-4 pb-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#EF5A5A] mb-2" />
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : funding ? (
            <Card className="p-4 bg-gray-100 rounded-xl">
              <div className="space-y-3">
                {/* Status Badge */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Detail Permohonan</h3>
                  {getStatusBadge(funding.confirmation_status)}
                </div>

                <p>
                  <strong>Nama Lengkap</strong>
                  <br /> {funding.purchase?.user?.name}
                </p>
                <p>
                  <strong>Email</strong>
                  <br /> {funding.purchase?.user?.email}
                </p>
                <p>
                  <strong>Alamat Tempat Tinggal</strong>
                  <br /> {funding.address}
                </p>
                <p>
                  <strong>No Telepon</strong>
                  <br /> {funding.phone_number}
                </p>
                <p>
                  <strong>NPWP</strong>
                  <br /> {funding.npwp}
                </p>
                <p>
                  <strong>Alamat Lokasi Franchise</strong>
                  <br /> {funding.franchise_address}
                </p>

                <div className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-800">
                      Scan KTP Franchisee
                    </p>
                    {downloadLink(funding.ktp, "Unduh Scan KTP")}
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-800">
                      Foto Diri Franchisee
                    </p>
                    {downloadLink(
                      funding.foto_diri,
                      "Unduh Foto Diri Franchisee"
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-800">
                      Foto Lokasi Franchise
                    </p>
                    {downloadLink(
                      funding.foto_lokasi,
                      "Unduh Foto Lokasi Franchise"
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-800">
                      Dokumen MoU Franchisor
                    </p>
                    {downloadLink(
                      funding.mou_franchisor,
                      "Unduh Dokumen MoU Franchisor"
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-800">
                      Dokumen MoU Modal
                    </p>
                    {downloadLink(funding.mou_modal, "Unduh Dokumen MoU Modal")}
                  </div>
                </div>

                {/* Action Buttons */}
                {getAvailableActions(funding.confirmation_status).length >
                  0 && (
                  <div className="flex gap-4 mt-6 justify-center">
                    {getAvailableActions(funding.confirmation_status).map(
                      (actionConfig) => (
                        <Button
                          key={actionConfig.action}
                          variant={
                            actionConfig.variant === "destructive"
                              ? "outline"
                              : "default"
                          }
                          className={
                            actionConfig.variant === "destructive"
                              ? "border-red-500 text-red-500 hover:bg-red-100"
                              : "bg-[#EF5A5A] text-white hover:bg-[#d34f4f]"
                          }
                          onClick={() => {
                            setActionStatus(actionConfig.action);
                            setOpen(true);
                          }}
                        >
                          {actionConfig.label}
                        </Button>
                      )
                    )}
                  </div>
                )}

                {/* Status sudah final */}
                {funding.confirmation_status === "ACCEPTED" && (
                  <div className="text-center mt-6 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800 font-medium">
                      ✅ Permohonan sudah disetujui dan tidak dapat diubah lagi
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <p className="text-center text-gray-500">Data tidak ditemukan</p>
          )}
        </div>
      </AdminLayout>

      {/* Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Aksi</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Apakah Anda yakin ingin mengubah status menjadi{" "}
              <strong>{actionStatus && getStatusLabel(actionStatus)}</strong>?
            </p>

            {actionStatus === "INTERVIEW" && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  📋 Status akan diubah ke tahap interview. Pastikan untuk
                  menghubungi calon franchisee untuk proses selanjutnya.
                </p>
              </div>
            )}

            {actionStatus === "ACCEPTED" && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ Permohonan akan disetujui dan status tidak dapat diubah
                  lagi setelah ini.
                </p>
              </div>
            )}

            {actionStatus === "REJECTED" && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-red-800 text-sm">
                  ❌ Permohonan akan ditolak. Pastikan keputusan ini sudah
                  tepat.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-[#EF5A5A] text-white hover:bg-[#d34f4f]"
              onClick={() => {
                if (actionStatus) handleAction(actionStatus);
              }}
            >
              Ya, Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Renderer */}
      <ToastRenderer />
    </>
  );
}

export default DetailFundingRequestPage;
