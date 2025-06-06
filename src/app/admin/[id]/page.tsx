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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserType } from "@/type/user";
import { ArrowLeft, CheckCircle, XCircle, Edit2, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function UserDetailPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<UserType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [revisiDialogOpen, setRevisiDialogOpen] = React.useState(false);
  const [revisiMessage, setRevisiMessage] = React.useState("");
  const [tolakDialogOpen, setTolakDialogOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const pathName = usePathname();
  const id = pathName.split("/").pop();

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
  const handleAction = async (action: "approve" | "reject" | "revisi") => {
    try {
      setActionLoading(true);

      // Buat payload berdasarkan action
      const payload = {
        id: id,
        action,
        message: action === "revisi" ? revisiMessage : undefined,
      };

      const res = await fetch("/api/admin/verify-account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // Jika berhasil, kembali ke halaman sebelumnya
        toast.success(
          `Akun berhasil ${
            action === "approve"
              ? "disetujui"
              : action === "reject"
              ? "ditolak"
              : "diminta revisi"
          }`
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
      setRevisiDialogOpen(false);
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
      <div className="w-full px-4 mt-4">
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
                      user.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : user.status === "revisi"
                        ? "bg-orange-100 text-orange-800"
                        : user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "pending"
                      ? "Pending"
                      : user.status === "revisi"
                      ? "Revisi"
                      : user.status === "active"
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

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleAction("approve")}
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
                onClick={() => setRevisiDialogOpen(true)}
                disabled={actionLoading}
                className="flex items-center justify-center space-x-1 bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                <span>Revisi</span>
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

      {/* Dialog Revisi */}
      <Dialog open={revisiDialogOpen} onOpenChange={setRevisiDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Kirim Permintaan Revisi</DialogTitle>
            <DialogDescription>
              Berikan detail tentang apa yang perlu direvisi oleh pengguna.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="revisiMessage" className="mb-2 block">
              Pesan Revisi
            </Label>
            <Input
              id="revisiMessage"
              value={revisiMessage}
              onChange={(e) => setRevisiMessage(e.target.value)}
              placeholder="Contoh: Mohon lampirkan dokumen identitas yang jelas"
              className="resize-none w-full"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevisiDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={() => handleAction("revisi")}
              disabled={!revisiMessage.trim() || actionLoading}
              className="bg-[#EF5A5A] hover:bg-[#c84d4d]"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Kirim Revisi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              onClick={() => handleAction("reject")}
              className="bg-[#EF5A5A] hover:bg-[#c84d4d] cursor-pointer"
            >
              Setuju
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
