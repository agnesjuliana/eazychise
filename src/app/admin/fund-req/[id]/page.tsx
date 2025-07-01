"use client";
import AdminLayout from "@/components/admin-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  Dialog,
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
  const [actionStatus, setActionStatus] = React.useState<
    "ACCEPTED" | "REJECTED" | null
  >(null);
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

  const handleAction = async (status: "ACCEPTED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/funding-request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        showToast("Status berhasil diperbarui", "success");
        router.push("/admin/fund-req");
      } else {
        showToast("Gagal memperbarui status", "destructive");
      }
    } catch (err) {
      showToast("Terjadi kesalahan saat memperbarui data", "destructive");
      console.error(err);
    }
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
            <Card className="p-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </div>
            </Card>
          ) : funding ? (
            <Card className="p-4 bg-gray-100 rounded-xl">
              <div className="space-y-3">
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

                <Dialog open={open} onOpenChange={setOpen}>
                  <div className="flex gap-4 mt-6 justify-center">
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-100"
                      onClick={() => {
                        setActionStatus("REJECTED");
                        setOpen(true);
                      }}
                    >
                      Tolak
                    </Button>
                    <Button
                      className="bg-[#EF5A5A] text-white hover:bg-[#d34f4f]"
                      onClick={() => {
                        setActionStatus("ACCEPTED");
                        setOpen(true);
                      }}
                    >
                      Setujui
                    </Button>
                  </div>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Konfirmasi Aksi</DialogTitle>
                    </DialogHeader>
                    <p>
                      Apakah Anda yakin ingin{" "}
                      <strong>
                        {actionStatus === "REJECTED" ? "menolak" : "menyetujui"}
                      </strong>{" "}
                      permintaan ini?
                    </p>
                    <DialogFooter className="pt-4">
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
              </div>
            </Card>
          ) : (
            <p className="text-center text-gray-500">Data tidak ditemukan</p>
          )}
        </div>
      </AdminLayout>

      {/* Toast Renderer Harus di luar AdminLayout */}
      <ToastRenderer />
    </>
  );
}

export default DetailFundingRequestPage;
