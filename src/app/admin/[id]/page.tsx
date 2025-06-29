"use client";
import AdminLayout from "@/components/admin-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { User as UserType } from "@/type/user";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Coffee,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import Image from "next/image";

import withAuth from "@/lib/withAuth";

function DetailPage() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState<
    | (UserType & {
        detail?: {
          id?: string;
          ktp?: string;
          foto_diri?: string;
        };
        franchise?: {
          id: string;
          name: string;
          price: number;
          image: string;
          status: string;
          location: string;
          ownership_document: string;
          financial_statement: string;
          proposal: string;
          sales_location: string;
          equipment: string;
          materials: string;
          listing_documents: Array<{
            id: string;
            type: string;
            name: string;
          }>;
          listings_highlights: Array<{
            id: string;
            title: string;
            content: string;
          }>;
        };
      })
    | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [tolakDialogOpen, setTolakDialogOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const pathName = usePathname();
  const id = pathName.split("/").pop();

  // Handle client-side mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function for currency formatting
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to safely handle image URLs
  const getSafeImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      return "/image/home/template-picture-franchise-food.png";
    }

    // Check if it's a valid URL format
    if (
      imageUrl.startsWith("/") ||
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    // Default fallback
    return "/image/home/template-picture-franchise-food.png";
  };

  // Fetch data user
  React.useEffect(() => {
    async function fetchUserDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.data);
        } else {
          toast.error("Gagal mengambil data pengguna");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchUserDetail();
    }
  }, [id]);

  // Handler untuk menerima, menolak, atau meminta revisi
  const handleAction = async (action: "ACCEPTED" | "REJECTED") => {
    try {
      setActionLoading(true);

      // Buat payload berdasarkan action
      const payload = {
        user_id: id,
        status: action,
      };

      const res = await fetch("/api/user/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status) {
        // Jika berhasil, kembali ke halaman sebelumnya
        toast.success(
          `Akun berhasil ${action === "ACCEPTED" ? "disetujui" : "ditolak"}`
        );
        router.push("/admin");
        router.refresh();
      } else {
        alert(data.message || "Gagal melakukan tindakan");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat melakukan tindakan");
    } finally {
      setActionLoading(false);
    }
  };

  // Format tanggal
  const formatDate = (dateInput: string | Date | undefined | null) => {
    if (!dateInput) return "Tanggal tidak tersedia";

    const date = new Date(dateInput);
    return isNaN(date.getTime())
      ? "Tanggal tidak valid"
      : date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <HeaderPage title="Detail Akun" />

      {/* Back Button */}
      <div className="w-full px-4 mt-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-gray-600 cursor-pointer"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali
        </Button>
      </div>

      {/* Content */}
      <div className="w-full px-4 mt-4 pb-4">
        {!mounted || loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#EF5A5A] mb-2" />
            <p className="text-gray-500">Memuat data...</p>
          </div>
        ) : user ? (
          <Card className="p-6 shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Informasi Akun</h2>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">Nama</Label>
                  <p className="font-medium">{user.name}</p>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Peran</Label>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-gray-500">Status</Label>
                  <span
                    className={`px-3 py-2 text-xs rounded-full font-semibold w-fit ${
                      user.status === "WAITING"
                        ? "bg-yellow-100 text-yellow-800"
                        : user.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "WAITING"
                      ? "Pending"
                      : user.status === "ACCEPTED"
                      ? "Aktif"
                      : "Ditolak"}
                  </span>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">
                    Tanggal Pendaftaran
                  </Label>
                  <p className="font-medium">
                    {(() => {
                      console.log("🧪 createdAt value:", user.createdAt);
                      return formatDate(user.createdAt);
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Show franchise details if user is a franchisor */}
            {user.role === "FRANCHISOR" && (
              <div className="mt-6 space-y-6">
                <h2 className="text-xl font-bold border-b pb-2">
                  Detail Franchisor
                </h2>

                {/* Data Diri Franchisor */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-md">Data Diri</h3>

                  {user.detail?.ktp && (
                    <div>
                      <Label className="text-xs text-gray-500">NIK</Label>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                        <p className="font-medium">{user.detail.ktp}</p>
                      </div>
                    </div>
                  )}

                  {user.detail?.foto_diri && (
                    <div>
                      <Label className="text-xs text-gray-500">Foto Diri</Label>
                      <div className="mt-2 relative h-48 w-48 border rounded-md overflow-hidden">
                        <Image
                          src={getSafeImageUrl(user.detail.foto_diri)}
                          alt="Franchisor Image"
                          width={600}
                          height={400}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Detail Franchise */}
                {user.franchise && (
                  <div className="space-y-4 mt-6">
                    <h3 className="font-semibold text-md border-b pb-2">
                      Detail Franchise
                    </h3>

                    {/* Franchise Image */}
                    <div>
                      <Label className="text-xs text-gray-500">
                        Foto Franchise
                      </Label>
                      <div className="mt-2 relative h-60 w-full md:w-3/4 border rounded-md overflow-hidden">
                        <Image
                          src={getSafeImageUrl(user.franchise.image)}
                          alt="Franchise Image"
                          width={600}
                          height={400}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">
                        Nama Franchise
                      </Label>
                      <p className="font-medium">{user.franchise.name}</p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Harga</Label>
                      <p className="font-medium">
                        {formatCurrency(user.franchise.price)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-xs text-gray-500">Status</Label>
                      <span className="px-3 py-2 text-xs rounded-full font-semibold w-fit bg-green-100 text-green-800">
                        {user.franchise.status === "OPEN" ? "Buka" : "Tutup"}
                      </span>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Lokasi</Label>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        <p className="font-medium">{user.franchise.location}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">
                        Lokasi Penjualan
                      </Label>
                      <p className="font-medium">
                        {user.franchise.sales_location}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Peralatan</Label>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-1 text-gray-500" />
                        <p className="font-medium">
                          {user.franchise.equipment}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">
                        Bahan-bahan
                      </Label>
                      <div className="flex items-center">
                        <Coffee className="h-4 w-4 mr-1 text-gray-500" />
                        <p className="font-medium">
                          {user.franchise.materials}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500 block mb-2">
                        Dokumen
                      </Label>
                      <div className="space-y-2">
                        <a
                          href={user.franchise.ownership_document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          <span>Sertifikat Kepemilikan</span>
                        </a>
                        <a
                          href={user.franchise.financial_statement}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          <span>Laporan Keuangan</span>
                        </a>
                        <a
                          href={user.franchise.proposal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          <span>Proposal</span>
                        </a>
                      </div>
                    </div>

                    {/* Listing Dokumen */}
                    {user.franchise.listing_documents &&
                      user.franchise.listing_documents.length > 0 && (
                        <div>
                          <Label className="text-xs text-gray-500 block mb-2">
                            Dokumen Listing
                          </Label>
                          <div className="space-y-2">
                            {user.franchise.listing_documents.map(
                              (doc, index) => (
                                <div
                                  key={index}
                                  className="flex items-center text-blue-600"
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  <span>{doc.name}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Listing Highlights */}
                    {user.franchise.listings_highlights &&
                      user.franchise.listings_highlights.length > 0 && (
                        <div>
                          <Label className="text-xs text-gray-500 block mb-2">
                            Keunggulan
                          </Label>
                          <div className="space-y-3">
                            {user.franchise.listings_highlights.map(
                              (highlight, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-50 p-3 rounded-md"
                                >
                                  <h3 className="font-medium text-sm">
                                    {highlight.title}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {highlight.content}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-6">
              <Button
                onClick={() => handleAction("ACCEPTED")}
                disabled={actionLoading}
                className="flex items-center justify-center space-x-1 bg-green-500 hover:bg-green-600 cursor-pointer"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Terima</span>
                  </>
                )}
              </Button>

              <Button
                onClick={() => setTolakDialogOpen(true)}
                disabled={actionLoading}
                className="flex items-center justify-center space-x-1 bg-red-500 hover:bg-red-600 cursor-pointer"
              >
                <XCircle className="h-4 w-4 mr-1" />
                <span>Tolak</span>
              </Button>
            </div>
          </Card>
        ) : (
          <p className="text-center text-gray-500">
            Data pengguna tidak ditemukan
          </p>
        )}
      </div>

      {/* Dialog Reject */}
      <Dialog open={tolakDialogOpen} onOpenChange={setTolakDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Apakah Anda Yakin?</DialogTitle>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTolakDialogOpen(false)}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={() => handleAction("REJECTED")}
              className="bg-[#EF5A5A] hover:bg-[#c84d4d] cursor-pointer"
            >
              Tolak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default withAuth(DetailPage, "ADMIN");
