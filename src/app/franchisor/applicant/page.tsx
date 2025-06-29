'use client';

import HeaderPage from '@/components/header';
import withAuth from '@/lib/withAuth';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const applicants = [
  { id: '1', name: 'Dwiyanto Putra', detail: 'Details' },
  { id: '2', name: 'Ambarahman Reiji', detail: 'Details' },
];

function ApplicantPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="relative">
          <HeaderPage title="Applicant" />
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-1/2 -translate-y-14 text-white z-10"
          >
            <ArrowLeft size={30} />
          </button>
        </div>

        {/* Subtext */}
        <div className="px-6 pt-4">
          <h2 className="text-lg font-semibold">Pecel Madiun Bu Ati</h2>
          <p className="text-xs text-[#6E7E9D]">daftar pemohon franchise Anda</p>
        </div>

        {/* List */}
        <main className="p-6 space-y-4">
          {applicants.map((applicant) => (
            <div
              key={applicant.id}
              onClick={() => router.push(`/applicant/${applicant.id}`)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <div>
                <div className="text-sm font-semibold text-gray-800">{applicant.name}</div>
                <div className="text-xs text-gray-500">{applicant.detail}</div>
              </div>
              <ArrowRight className="text-gray-500" />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default withAuth(ApplicantPage, 'ADMIN');
