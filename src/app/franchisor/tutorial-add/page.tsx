"use client";

import HeaderPage from "@/components/header";

import withAuth from "@/lib/withAuth";
import CustomUploadFile from "@/components/CustomUploadFile";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function TutorialAddPage() {
  const router = useRouter();

  // State untuk menyimpan file dan nama file
  const [tutorialFile, setTutorialFile] = useState<File | null>(null);
  const [tutorialFileName, setTutorialFileName] = useState("");
  const [guidelineFile, setGuidelineFile] = useState<File | null>(null);
  const [guidelineFileName, setGuidelineFileName] = useState("");

  const handleFileChange =
    (setFile: (file: File | null) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFile(file);
      }
    };

  const handleSubmit = () => {
    // Di sini logika untuk mengirim data ke backend
    console.log("Submitting data:", {
      tutorialFile,
      tutorialFileName,
      guidelineFile,
      guidelineFileName,
    });
    alert("Data (cek console) akan di-upload!");
    // router.push('/path-sukses-upload');
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex justify-center`}>
      <div className="w-full max-w-md relative">
        {/* Header Baru */}
        <div className="relative">
          {/* Komponen header utama Anda */}
          <HeaderPage title="Tambah Tutorial" />

          {/* Tombol kembali yang "mengambang" di atas */}
          <button
            onClick={() => router.push("/tutorial")}
            className="absolute left-6 top-1/2 -translate-y-14 text-white z-10" // Sesuaikan posisi jika perlu
          >
            <ArrowLeft size={30} />
          </button>
        </div>
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
            <CustomUploadFile
              id="tutorial-upload"
              title="Tutorial"
              onFileChange={handleFileChange(setTutorialFile)}
              fileName={tutorialFile?.name || null}
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
            <CustomUploadFile
              id="guideline-upload"
              title="Guideline"
              onFileChange={handleFileChange(setGuidelineFile)}
              fileName={guidelineFile?.name || null}
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
  );
}

export default withAuth(TutorialAddPage, "FRANCHISOR");
