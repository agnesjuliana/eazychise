"use client";

import FranchisorLayout from "@/components/franchisor-layout";
import HeaderPage from "@/components/header";
import withAuth from "@/lib/withAuth";
import CloudinaryUploader from "@/components/CloudinaryUploader";
import { CloudinaryUploadResult } from "@/lib/cloudinary";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListingDocument } from "@/type/tutorial";
import { toast } from "sonner";

function TutorialEditPage() {
  const router = useRouter();
  const params = useParams();
  const tutorialId = params?.id as string;

  const [tutorialName, setTutorialName] = useState("");
  const [originalPath, setOriginalPath] = useState(""); // Store original path
  const [newUploadedUrl, setNewUploadedUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch tutorial data
  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const response = await fetch('/api/tutorials');
        const result = await response.json();
        
        if (result.success || result.status === true) {
          const tutorials = result.data || [];
          const tutorial = tutorials.find((t: ListingDocument) => t.id === tutorialId);
          
          if (tutorial) {
            setTutorialName(tutorial.name);
            setOriginalPath(tutorial.path); // Store original path
          } else {
            toast.error('Tutorial tidak ditemukan');
            router.push('/franchisor/training');
          }
        } else {
          toast.error('Gagal memuat data tutorial');
          router.push('/franchisor/training');
        }
      } catch (error) {
        console.error('Error fetching tutorial:', error);
        toast.error('Gagal memuat data tutorial');
        router.push('/franchisor/training');
      } finally {
        setLoading(false);
      }
    };

    if (tutorialId) {
      fetchTutorial();
    }
  }, [tutorialId, router]);

  const handleCloudinaryUpload = (result: CloudinaryUploadResult) => {
    if (result.secure_url) {
      setNewUploadedUrl(result.secure_url);
      console.log("New file uploaded to Cloudinary:", result.secure_url);
    }
  };

  const handleUpdate = async () => {
    if (!tutorialName) {
      toast.error("Nama tutorial harus diisi!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Determine which path to use
      let finalPath = originalPath; // Default to original path
      
      // If new file was uploaded to Cloudinary, use the new URL
      if (newUploadedUrl) {
        finalPath = newUploadedUrl;
      }

      const response = await fetch(`/api/tutorials/${tutorialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tutorialName,
          path: finalPath,
          type: 'GUIDELINES'
        }),
      });

      const result = await response.json();

      if (response.ok && result.status == true) {
        toast.success("Tutorial berhasil diupdate!");
        router.push('/franchisor/training');
      } else {
        toast.error("Error: " + (result.message || 'Gagal mengupdate tutorial'));
      }
    } catch (error) {
      console.error("Error updating tutorial:", error);
      toast.error("Terjadi kesalahan saat mengupdate data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus tutorial ini?")) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/tutorials/${tutorialId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Tutorial berhasil dihapus!");
        router.push('/franchisor/training');
      } else {
        toast.error("Error: " + (result.message || 'Gagal menghapus tutorial'));
      }
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      toast.error("Terjadi kesalahan saat menghapus data");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <FranchisorLayout className="overflow-x-hidden">
        <HeaderPage title="Edit Tutorial" />
        <div className="p-4 text-center">
          <p className="text-gray-500">Memuat data tutorial...</p>
        </div>
      </FranchisorLayout>
    );
  }

  return (
    <FranchisorLayout className="overflow-x-hidden">
      {/* Header */}
      <HeaderPage title="Edit Tutorial" />
      
      {/* Tombol Kembali */}
      <div className="px-4 pt-4">
        <Button
          variant="outline"
          className="mb-4 flex items-center gap-2 text-[#EF5A5A] border-[#EF5A5A] hover:bg-[#ffeaea]"
          onClick={() => router.push('/franchisor/training')}
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </Button>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Title */}
        <div>
          <h2 className="text-lg font-semibold">Edit Tutorial</h2>
          <p className="text-xs text-[#6E7E9D]">
            Edit nama dan path file tutorial Anda
          </p>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Tutorial Section */}
          <div className="space-y-4">
            <div className="bg-[#EF5A5A] text-white text-center p-2 rounded-t-lg font-semibold mb-1">
              Edit Tutorial
            </div>
            <div className="border border-gray-300 rounded-b-lg p-4">
              <div className="space-y-4">
                {/* Nama Tutorial */}
                <div>
                  <Label htmlFor="tutorial-name" className="font-semibold">
                    Nama Tutorial
                  </Label>
                  <Input
                    id="tutorial-name"
                    placeholder="Tulis nama tutorial di sini"
                    value={tutorialName}
                    onChange={(e) => setTutorialName(e.target.value)}
                    className="mt-1 bg-[#F7F7F7] text-[#6E7E9D] text-xs"
                  />
                </div>

                {/* Current File Info */}
                <div>
                  <Label className="font-semibold">File Tutorial Saat Ini</Label>
                  <div className="mt-1 p-3 bg-gray-100 rounded border text-sm">
                    <a
                      href={originalPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {originalPath.split("/").pop()}
                    </a>
                    <p className="text-gray-500 text-xs mt-1">
                      File ini akan tetap digunakan kecuali Anda upload file baru
                    </p>
                  </div>
                </div>

                {/* Upload File Baru (Opsional) */}
                <div>
                  <Label className="font-semibold">Upload File Baru (Opsional)</Label>
                  <div className="mt-1">
                    <CloudinaryUploader
                      id="tutorial-upload"
                      title="Upload Tutorial Baru"
                      onUploadComplete={handleCloudinaryUpload}
                      acceptedTypes={["pdf", "docx"]}
                      maxSizeMB={15}
                    />
                    {newUploadedUrl && (
                      <p className="text-green-600 text-xs mt-2">
                        ✅ File baru berhasil diupload
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Jika Anda upload file baru, path file akan diupdate. Jika tidak, file lama akan tetap digunakan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="bg-[#EF5A5A] text-white hover:bg-[#d94a4a] py-3 px-27 text-base disabled:opacity-50"
            >
              {isSubmitting ? "Mengupdate..." : "Update Tutorial"}
            </Button>
            
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
              className="bg-red-600 text-white hover:bg-red-700 py-3 px-27 text-base disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Menghapus..." : "Hapus Tutorial"}
            </Button>
          </div>
        </div>
      </div>
    </FranchisorLayout>
  );
}

export default withAuth(TutorialEditPage, "FRANCHISOR");
