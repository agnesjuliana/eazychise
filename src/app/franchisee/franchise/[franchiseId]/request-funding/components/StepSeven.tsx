"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Plus } from "lucide-react";
import { useState } from "react";

export default function StepSeven() {
  const [files, setFiles] = useState({
    mouFranchisor: null as File | null,
    mouModal: null as File | null,
  });

  const handleFileUpload = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleDownload = (documentType: string) => {
    // Handle document download logic here
    console.log(`Downloading ${documentType}`);
  };

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold text-black mb-6">
        Tanda Tangan Perjanjian
      </h1>

      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          FundChise akan melindungi hak anda sebagai franchisee dan melindungi
          hak franchisor. Tanda tangani dokumen perjanjian berikut untuk
          kebaikan kedua pihak.
        </p>

        <p className="text-sm text-orange-500 font-medium">
          Tanda tangan harus disertai materai Rp. 10.000
        </p>

        {/* Download Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => handleDownload("MoU Franchisor")}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white flex items-center justify-center gap-2 py-3"
          >
            <Download className="w-4 h-4" />
            Unduh Dokumen MoU Franchsisor
          </Button>

          <Button
            onClick={() => handleDownload("MoU Modal")}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white flex items-center justify-center gap-2 py-3"
          >
            <Download className="w-4 h-4" />
            Unduh Dokumen MoU Modal
          </Button>
        </div>

        {/* Upload MoU Franchisor */}
        <div className="space-y-2 mt-8">
          <Label className="text-sm font-medium text-black">
            Upload Dokumen MoU Franchsisor
          </Label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              onChange={(e) =>
                handleFileUpload("mouFranchisor", e.target.files?.[0] || null)
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors min-h-[120px]">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              {files.mouFranchisor ? (
                <span className="text-sm text-gray-600 text-center">
                  {files.mouFranchisor.name}
                </span>
              ) : (
                <span className="text-sm text-gray-500 text-center">
                  Upload file
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Upload MoU Modal */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Upload Dokumen MoU Modal
          </Label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              onChange={(e) =>
                handleFileUpload("mouModal", e.target.files?.[0] || null)
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors min-h-[120px]">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              {files.mouModal ? (
                <span className="text-sm text-gray-600 text-center">
                  {files.mouModal.name}
                </span>
              ) : (
                <span className="text-sm text-gray-500 text-center">
                  Upload file
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
