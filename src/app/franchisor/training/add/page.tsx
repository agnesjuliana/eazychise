"use client";

import HeaderPage from "@/components/header";
import withAuth from "@/lib/withAuth";
import CloudinaryUploader, { CloudinaryUploadResult } from "@/components/CloudinaryUploader";
import {
  FileUploadResult,
  getUploadedFiles,
  getSavedFiles,
} from "@/utils/fileUtils";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FranchisorLayout from "@/components/franchisor-layout";

function TutorialAddPage() {
  const router = useRouter();

  // State untuk menyimpan nama file dan path upload
  const [tutorialFileName, setTutorialFileName] = useState("");
  const [tutorialUploadPath, setTutorialUploadPath] = useState<string>("");

  const handleTutorialUploadComplete = (result: FileUploadResult | CloudinaryUploadResult) => {
    if (result.success) {
      const fileUrl = ('url' in result && result.url) ? result.url : result.path;
      if (fileUrl) {
        setTutorialUploadPath(fileUrl);
        console.log("Tutorial uploaded to:", fileUrl);
      }
    }
  };

  // const handleGuidelineUploadComplete = (result: FileUploadResult) => {
  //   if (result.success && result.path) {
  //     setGuidelineUploadPath(result.path);
  //     console.log("Guideline uploaded to:", result.path);
  //   }
  // };

  const handleSubmit = async () => {
    // Get uploaded files dari sessionStorage dan localStorage
    const uploadedFiles = getUploadedFiles();
    const savedFiles = getSavedFiles();

    // Data untuk di-submit ke backend
    console.log("Submitting data:", {
      tutorialFileName,
      tutorialUploadPath,
      allUploadedFiles: uploadedFiles,
      allSavedFiles: savedFiles,
    });

    // Submit tutorial (jika ada file dan nama)
    if (tutorialFileName && tutorialUploadPath) {
      try {
        const res = await fetch("/api/tutorials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: tutorialFileName,
            path: tutorialUploadPath,
            type: "GUIDELINES",
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert("Gagal menambah tutorial: " + (data?.message || res.status));
          return;
        }
      } catch (err) {
        alert("Gagal submit tutorial: " + err);
        return;
      }
    }

    alert("Data berhasil disubmit dan tutorial berhasil ditambahkan!");
    router.push('/franchisor/training');
  };

  return (
    <FranchisorLayout className="overflow-x-hidden">
      {/* Header Baru */}
      <div className="relative">
        <HeaderPage title="Tambah Tutorial" />
        {/* Tombol kembali yang "mengambang" di atas */}
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-1/2 -translate-y-14 text-white z-10"
        >
          <ArrowLeft size={30} />
        </button>
      </div>

      {/* Form Content */}
      <main className="p-6 space-y-6">
        {/* Tutorial Section */}
        <div className="space-y-4">
          <Label htmlFor="tutorial-name" className="font-semibold">
              Upload File
            </Label>
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
    </FranchisorLayout>
  );
}

export default withAuth(TutorialAddPage, "FRANCHISOR");
