"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import withAuth from "@/lib/withAuth";
import HeaderPage from "@/components/header";
import CloudinaryUploader, { CloudinaryUploadResult } from "@/components/CloudinaryUploader";
import {
  FileUploadResult,
  getUploadedFiles,
  getSavedFiles,
} from "@/utils/fileUtils";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function TutorialAddPage() {
  const router = useRouter();
  
  // State untuk menyimpan nama file dan path upload
  const [tutorialFileName, setTutorialFileName] = useState("");
  const [tutorialUploadPath, setTutorialUploadPath] = useState<string>("");
  const [guidelineFileName, setGuidelineFileName] = useState("");
  const [guidelineUploadPath, setGuidelineUploadPath] = useState<string>("");

  const handleTutorialUploadComplete = (result: FileUploadResult | CloudinaryUploadResult) => {
    if (result.success) {
      const fileUrl = ('url' in result && result.url) ? result.url : result.path;
      if (fileUrl) {
        setTutorialUploadPath(fileUrl);
        console.log("Tutorial uploaded to:", fileUrl);
      }
    }
  };

  const handleGuidelineUploadComplete = (result: FileUploadResult | CloudinaryUploadResult) => {
    if (result.success) {
      const fileUrl = ('url' in result && result.url) ? result.url : result.path;
      if (fileUrl) {
        setGuidelineUploadPath(fileUrl);
        console.log("Guideline uploaded to:", fileUrl);
      }
    }
  };

  const handleSubmit = () => {
    // Get uploaded files dari sessionStorage dan localStorage
    const uploadedFiles = getUploadedFiles();
    const savedFiles = getSavedFiles();

    // Data untuk di-submit ke backend
    console.log("Submitting data:", {
      tutorialFileName,
      tutorialUploadPath,
      guidelineFileName,
      guidelineUploadPath,
      allUploadedFiles: uploadedFiles,
      allSavedFiles: savedFiles,
    });

    alert(
      "Data berhasil disubmit! File tersimpan di localStorage. Cek console untuk detail."
    );
    // router.push('/path-sukses-upload');
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex justify-center`}>
      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="flex flex-col gap-4 fixed top-0 left-0 right-0 z-50 max-w-md mx-auto bg-gray-50 w-full">
          <HeaderPage title="Tambah Tutorial" />
          <button
            onClick={() => router.back()}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div style={{ height: "180px" }} className="w-full bg-gray-50"></div>
        
        <div className="min-h-screen bg-gray-50">
          {/* Title */}
          <div className="px-6 pt-4">
            <h2 className="text-lg font-semibold">Pecel Madiun Bu Ati</h2>
            <p className="text-xs text-[#6E7E9D]">
              tambahkan tutorial maupun guideline untuk franchisemu!
            </p>
          </div>
          {/* Form Content */}
          <main className="p-6 space-y-6">
          {/* Tutorial Section */}
          <div className="space-y-4">
            <CloudinaryUploader
              id="tutorial-upload"
              title="Tutorial"
              onUploadComplete={handleTutorialUploadComplete}
              maxSizeMB={15}
              acceptedTypes={["pdf", "docx"]}
              currentUrl={tutorialUploadPath || ""}
            />
            <div>
              <Label htmlFor="tutorial-name" className="font-semibold">
                Nama File
              </Label>
              <Input
                id="tutorial-name"
                placeholder="Tulis nama di sini"
                value={tutorialFileName}
                onChange={(e) => setTutorialFileName(e.target.value)}
                className="mt-1 bg-[#F7F7F7] text-[#6E7E9D] text-xs"
              />
            </div>
          </div>

          {/* Guideline Section */}
          <div className="space-y-4">
            <CloudinaryUploader
              id="guideline-upload"
              title="Guideline"
              onUploadComplete={handleGuidelineUploadComplete}
              maxSizeMB={10}
              acceptedTypes={["pdf", "docx"]}
              currentUrl={guidelineUploadPath || ""}
            />
            <div>
              <Label htmlFor="guideline-name" className="font-semibold">
                Nama File
              </Label>
              <Input
                id="guideline-name"
                placeholder="Tulis nama di sini"
                value={guidelineFileName}
                onChange={(e) => setGuidelineFileName(e.target.value)}
                className="mt-1 bg-[#F7F7F7] text-[#6E7E9D] text-xs"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-[#EF5A5A] text-white hover:bg-[#d94a4a] py-3 px-27 text-base"
            >
              tambah
            </Button>
          </div>
        </main>
        </div>
      </div>
    </div>
  );
}

export default withAuth(TutorialAddPage, "FRANCHISOR");
