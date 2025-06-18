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
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import withAuth from "@/lib/withAuth";
import FranchiseDetail, {
  FranchiseData,
} from "@/app/admin/components/franchise-detail";

function DetailPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<UserType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [tolakDialogOpen, setTolakDialogOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const pathName = usePathname();
  const id = pathName.split("/").pop();
  // Dummy data for franchise details (franchisor)
  const franchiseData: FranchiseData = {
    name: "Franchise Kopi Nusantara",
    price: 7500000,
    image: "/image/home/template-picture-franchise-food.png",
    status: "active",
    location: "Bandung, Indonesia",
    ownership_document: "http://example.com/ownership-certificate.pdf",
    financial_statement: "http://example.com/financial-statement.pdf",
    proposal: "http://example.com/proposal.pdf",
    sales_location: "Mall Paris Van Java, Second Floor",
    equipment: "Espresso Machine, Grinder, Blender",
    materials: "Coffee Beans, Sugar, Cream, Syrup",
    ktp: "654321098765432",
    foto_diri: "/image/home/template-picture-franchise-food.png",
    listing_documents: [
      {
        name: "Franchise Agreement",
        path: "http://example.com/franchise-agreement.pdf",
      },
      {
        name: "Business Model Canvas",
        path: "http://example.com/business-canvas.pdf",
      },
    ],
    listing_highlights: [
      {
        title: "High Demand Product",
        content: "Coffee culture growing rapidly in Bandung.",
      },
      {
        title: "Comprehensive Support",
        content: "Training, marketing, and operational assistance provided.",
      },
    ],
  };

  // Fetch data user
  React.useEffect(() => {
    async function fetchUserDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();

        if (data.success) {
          setUser(data.data);
        } else {
          alert("Gagal mengambil data pengguna");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
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
        {loading ? (
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
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Show franchise details if user is a franchisor */}
            {user.role === "FRANCHISOR" && (
              <FranchiseDetail franchiseData={franchiseData} />
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
