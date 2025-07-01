import Image from "next/image";
import React from "react";

interface StepNineProps {
  isApproved?: boolean;
}

export default function StepNine({ isApproved = true }: StepNineProps) {
  return (
    <>
      <Image
        src="/image/franchisee/request-funding/request-funding-5.png"
        alt="step 9 result image"
        width={346}
        height={240}
      />

      {isApproved ? (
        // Use Case Success Condition: Approved
        <>
          <h1 className="mt-4 w-full text-center text-2xl font-medium text-green-600 mb-6">
            🎉 Selamat! Anda Lolos Seleksi
          </h1>
          <div className="w-full bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Permohonan Modal Diterima
              </h2>
              <p className="text-sm text-green-700 leading-relaxed">
                Selamat! Permohonan modal Anda telah disetujui. Tim kami akan
                segera menghubungi Anda untuk proses selanjutnya. Anda dapat
                mengakses halaman franchise untuk melihat status dan detail
                lebih lanjut.
              </p>
            </div>

            <div className="border-t border-green-200 pt-4">
              <p className="text-xs text-green-600 text-center">
                📧 Cek email Anda untuk instruksi lebih lanjut
              </p>
            </div>
          </div>
        </>
      ) : (
        // Use Case Alternative 10.1: Not approved
        <>
          <h1 className="mt-4 w-full text-center text-2xl font-medium text-red-600 mb-6">
            Mohon Maaf, Anda Belum Lolos Seleksi
          </h1>
          <div className="w-full bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Tidak Lolos Seleksi
              </h2>
              <p className="text-sm text-red-700 leading-relaxed mb-4">
                Mohon maaf, setelah melalui proses evaluasi dan wawancara,
                permohonan modal Anda belum dapat kami setujui pada kesempatan
                ini.
              </p>
              <p className="text-sm text-red-600 font-medium">
                Silakan coba lagi di kesempatan berikutnya
              </p>
            </div>

            <div className="border-t border-red-200 pt-4 space-y-2">
              <p className="text-xs text-red-600 text-center mb-2">
                💡 Tips untuk meningkatkan peluang di masa depan:
              </p>
              <ul className="text-xs text-red-600 space-y-1">
                <li>• Perkuat rencana bisnis dan analisis finansial</li>
                <li>• Lengkapi dokumen pendukung</li>
                <li>• Pertimbangkan lokasi yang lebih strategis</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
}
