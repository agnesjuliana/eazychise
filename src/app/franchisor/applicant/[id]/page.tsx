'use client';

import HeaderPage from '@/components/header';
import withAuth from '@/lib/withAuth';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const applicant = {
  name: 'Dwiyanto Putra',
  email: 'Dwiyanto28@email.com',
  address: 'Jalan Aja Dulu',
  phone: '082327184928',
  npwp: 'XXXXXXXXXX',
  franchiseAddress: 'Jalan Aja Dulu',
  ktp: 'KTP.png',
  photo: 'Foto_Diri.png',
  franchisePhoto: 'Foto_Lokasi_Franchise.png',
};

function ApplicantDetailPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md relative">
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
          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-center">{applicant.name}</h2>

            <DetailField label="Email" value={applicant.email} />
            <DetailField label="Alamat Tempat Tinggal" value={applicant.address} />
            <DetailField label="No Telepon" value={applicant.phone} />
            <DetailField label="NPWP" value={applicant.npwp} />
            <DetailField label="Alamat Lokasi Franchise" value={applicant.franchiseAddress} />
            <DetailField label="Foto KTP" value={applicant.ktp} />
            <DetailField label="Foto Diri" value={applicant.photo} />
            <DetailField label="Foto Lokasi Franchise" value={applicant.franchisePhoto} />

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <Button
                variant="outline"
                className="w-full text-[#EF5A5A] border-[#EF5A5A] hover:bg-red-50"
              >
                Tolak
              </Button>
              <Button className="w-full bg-[#EF5A5A] text-white hover:bg-[#d94a4a]">
                Terima
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label className="font-semibold text-sm">{label}</Label>
      <Input
        readOnly
        value={value}
        className="mt-1 bg-[#F7F7F7] text-[#6E7E9D] text-xs"
      />
    </div>
  );
}

export default withAuth(ApplicantDetailPage, 'ADMIN');
