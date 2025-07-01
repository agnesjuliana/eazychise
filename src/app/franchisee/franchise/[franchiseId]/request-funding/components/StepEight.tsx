import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

interface StepEightProps {
  mouFranchisor?: string;
  mouModal?: string;
}

export default function StepEight({ mouFranchisor, mouModal }: StepEightProps) {
  const handleViewDocument = (url: string, title: string) => {
    if (url && url !== "") {
      window.open(url, "_blank");
    } else {
      alert(`${title} belum tersedia`);
    }
  };

  const handleDownloadDocument = (url: string, title: string) => {
    if (url && url !== "") {
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "_")}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`${title} belum tersedia`);
    }
  };

  return (
    <>
      <Image
        src="/image/franchisee/request-funding/request-funding-2.png"
        alt="step 8 image"
        width={346}
        height={240}
      />
      <h1 className="mt-4 w-full text-center text-2xl font-medium text-black mb-6">
        Dokumen sedang diverifikasi!
      </h1>

      <div className="w-full space-y-4 mt-6">
        <p className="text-center text-gray-600 text-sm">
          Dokumen MoU Anda sudah berhasil dikirim dan sedang dalam proses
          verifikasi. Silakan tunggu konfirmasi lebih lanjut.
        </p>

        {/* MoU Documents Status */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-800 text-center mb-4">
            Dokumen MoU yang Telah Dikirim
          </h3>

          {/* MoU Franchisor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">MoU Franchisor</p>
                  <p className="text-xs text-gray-500">
                    {mouFranchisor && mouFranchisor !== "" ? (
                      <span className="text-green-600">✓ Dokumen tersedia</span>
                    ) : (
                      <span className="text-red-500">
                        ✗ Dokumen belum tersedia
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleViewDocument(mouFranchisor || "", "MoU Franchisor")
                  }
                  disabled={!mouFranchisor || mouFranchisor === ""}
                  className="flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleDownloadDocument(
                      mouFranchisor || "",
                      "MoU_Franchisor"
                    )
                  }
                  disabled={!mouFranchisor || mouFranchisor === ""}
                  className="flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh</span>
                </Button>
              </div>
            </div>
          </div>

          {/* MoU Modal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">MoU Modal</p>
                  <p className="text-xs text-gray-500">
                    {mouModal && mouModal !== "" ? (
                      <span className="text-green-600">✓ Dokumen tersedia</span>
                    ) : (
                      <span className="text-red-500">
                        ✗ Dokumen belum tersedia
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleViewDocument(mouModal || "", "MoU Modal")
                  }
                  disabled={!mouModal || mouModal === ""}
                  className="flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleDownloadDocument(mouModal || "", "MoU_Modal")
                  }
                  disabled={!mouModal || mouModal === ""}
                  className="flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Informasi Proses Verifikasi
              </p>
              <p className="text-sm text-blue-700">
                Tim kami sedang melakukan verifikasi dokumen MoU yang Anda
                kirimkan. Proses ini biasanya memakan waktu 1-3 hari kerja. Anda
                akan mendapat notifikasi melalui email ketika verifikasi
                selesai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
