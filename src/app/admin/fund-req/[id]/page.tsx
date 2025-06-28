"use client";
import AdminLayout from "@/components/admin-layout";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

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
  

  React.useEffect(() => {
    const fetchFunding = async () => {
      try {
        const res = await fetch(`/api/funding-request/${id}`);
        const data = await res.json();

        if (data.status) {
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
      className="w-full bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded text-sm font-semibold text-center"
    >
      {text}
    </a>
  );

  return (
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

              <div className="space-y-2 pt-4">
                <p className="font-semibold">Scan KTP Franchisee</p>
                {downloadLink(funding.ktp, "Unduh Scan KTP")}

                <p className="font-semibold">Foto Diri Franchisee</p>
                {downloadLink(funding.foto_diri, "Unduh Foto Diri Franchisee")}

                <p className="font-semibold">Foto Lokasi Franchise</p>
                {downloadLink(funding.foto_lokasi, "Unduh Foto Lokasi Franchise")}

                <p className="font-semibold">Dokumen MoU Franchisor</p>
                {downloadLink(funding.mou_franchisor, "Unduh Dokumen MoU Franchisor")}

                <p className="font-semibold">Dokumen MoU Modal</p>
                {downloadLink(funding.mou_modal, "Unduh Dokumen MoU Modal")}
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-100">
                  Tolak
                </Button>
                <Button className="bg-[#EF5A5A] text-white hover:bg-[#d34f4f]">
                  Setujui
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <p className="text-center text-gray-500">Data tidak ditemukan</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default DetailFundingRequestPage;
