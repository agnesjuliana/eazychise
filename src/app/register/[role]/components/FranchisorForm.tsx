"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import CustomUploadFile from "@/components/CustomUploadFile";
import { FranchisorRegistrationPayload } from "@/type/registration";
import { FileUploadResult } from "@/utils/fileUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FranchisorFormProps {
  onSuccess?: () => void;
}

export default function FranchisorForm({ onSuccess }: FranchisorFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Basic info
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Franchisor personal data
    ktp: "",
    foto_diri: "",
    
    // Franchise data
    franchiseName: "",
    price: "",
    image: "",
    status: "available",
    location: "",
    ownership_document: "",
    financial_statement: "",
    proposal: "",
    sales_location: "",
    equipment: "",
    materials: "",
  });

  const [highlights, setHighlights] = useState([
    { title: "", content: "" }
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState({
    ktp: null as string | null,
    foto_diri: null as string | null,
    ownership_document: null as string | null,
    financial_statement: null as string | null,
    proposal: null as string | null,
    image: null as string | null,
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateHighlight = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...highlights];
    updated[index][field] = value;
    setHighlights(updated);
  };

  const addHighlight = () => {
    setHighlights([...highlights, { title: "", content: "" }]);
  };

  const removeHighlight = (index: number) => {
    if (highlights.length > 1) {
      setHighlights(highlights.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = (field: keyof typeof uploadedFiles, result: FileUploadResult) => {
    if (result.success && result.path) {
      setUploadedFiles(prev => ({ ...prev, [field]: result.path }));
      setFormData(prev => ({ ...prev, [field]: result.path }));
    }
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword);
      case 2:
        return !!(uploadedFiles.ktp && uploadedFiles.foto_diri);
      case 3:
        return !!(formData.franchiseName && formData.price && formData.location && formData.sales_location && formData.equipment && formData.materials && highlights.every(h => h.title && h.content));
      case 4:
        return !!(uploadedFiles.ownership_document && uploadedFiles.financial_statement && uploadedFiles.proposal);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError("");
    } else {
      setError("Harap lengkapi semua field yang diperlukan");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) {
      setError("Harap lengkapi semua field yang diperlukan");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload: FranchisorRegistrationPayload = {
        // User data
        name: formData.name,
        email: formData.email,
        password: formData.password,
        
        // Franchisor profile
        franchisor_data: {
          ktp: formData.ktp,
          foto_diri: formData.foto_diri,
        },
        
        // Franchise listing
        franchise_data: {
          name: formData.franchiseName,
          price: parseInt(formData.price),
          image: formData.image || "",
          status: formData.status,
          location: formData.location,
          ownership_document: formData.ownership_document,
          financial_statement: formData.financial_statement,
          proposal: formData.proposal,
          sales_location: formData.sales_location,
          equipment: formData.equipment,
          materials: formData.materials,
          category_id: ["fa3a59bb-b003-4c27-9497-c2f3e333cabc"],
          listing_documents: [], // Additional documents if any
          listing_highlights: highlights.filter(h => h.title && h.content),
        },
      };

      const response = await fetch("/api/register/franchisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registrasi gagal");
      }

      setDialogOpen(true);
      setTimeout(() => {
        router.push("/login");
        onSuccess?.();
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-6">Informasi Dasar</h2>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Masukkan email"
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Masukkan password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Konfirmasi password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-6">Upload Dokumen Identitas</h2>
            
            <CustomUploadFile
              id="ktp"
              title="Upload KTP"
              onFileChange={() => {}}
              fileName={uploadedFiles.ktp}
              onUploadComplete={(result) => handleFileUpload('ktp', result)}
              acceptedTypes={['jpg', 'jpeg', 'png']}
              maxSizeMB={5}
            />

            <CustomUploadFile
              id="foto_diri"
              title="Upload Foto Diri"
              onFileChange={() => {}}
              fileName={uploadedFiles.foto_diri}
              onUploadComplete={(result) => handleFileUpload('foto_diri', result)}
              acceptedTypes={['jpg', 'jpeg', 'png']}
              maxSizeMB={5}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-6">Informasi Franchise</h2>
            
            <div className="space-y-2">
              <Label htmlFor="franchiseName">Nama Franchise</Label>
              <Input
                id="franchiseName"
                value={formData.franchiseName}
                onChange={(e) => updateField("franchiseName", e.target.value)}
                placeholder="Masukkan nama franchise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="Masukkan harga franchise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Masukkan lokasi franchise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sales_location">Lokasi Penjualan</Label>
              <Input
                id="sales_location"
                value={formData.sales_location}
                onChange={(e) => updateField("sales_location", e.target.value)}
                placeholder="Masukkan lokasi penjualan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Peralatan</Label>
              <Input
                id="equipment"
                value={formData.equipment}
                onChange={(e) => updateField("equipment", e.target.value)}
                placeholder="Deskripsi peralatan yang disediakan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="materials">Bahan Baku</Label>
              <Input
                id="materials"
                value={formData.materials}
                onChange={(e) => updateField("materials", e.target.value)}
                placeholder="Deskripsi bahan baku yang disediakan"
              />
            </div>

            <div className="space-y-2">
              <Label>Keunggulan Franchise</Label>
              {highlights.map((highlight, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Keunggulan {index + 1}</span>
                    {highlights.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHighlight(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Judul keunggulan"
                    value={highlight.title}
                    onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Deskripsi keunggulan"
                    value={highlight.content}
                    onChange={(e) => updateHighlight(index, 'content', e.target.value)}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addHighlight}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Keunggulan
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-6">Upload Dokumen Bisnis</h2>
            
            <CustomUploadFile
              id="ownership_document"
              title="Dokumen Kepemilikan"
              onFileChange={() => {}}
              fileName={uploadedFiles.ownership_document}
              onUploadComplete={(result) => handleFileUpload('ownership_document', result)}
              acceptedTypes={['pdf', 'doc', 'docx']}
            />

            <CustomUploadFile
              id="financial_statement"
              title="Laporan Keuangan"
              onFileChange={() => {}}
              fileName={uploadedFiles.financial_statement}
              onUploadComplete={(result) => handleFileUpload('financial_statement', result)}
              acceptedTypes={['pdf', 'doc', 'docx']}
            />

            <CustomUploadFile
              id="proposal"
              title="Proposal Bisnis"
              onFileChange={() => {}}
              fileName={uploadedFiles.proposal}
              onUploadComplete={(result) => handleFileUpload('proposal', result)}
              acceptedTypes={['pdf', 'doc', 'docx']}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Registrasi Berhasil!</DialogTitle>
            <DialogDescription>
              Registrasi franchisor berhasil. Menunggu verifikasi admin.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-lg p-6 shadow-xl rounded-2xl border border-gray-200">
        {/* Back Button di dalam card */}
        <div className="flex justify-start mb-2">
          <BackButton fallbackUrl="/start" variant="ghost" size="sm" />
        </div>

        <div className="flex justify-center mb-4">
          <Image
            src="/image/auth/register.png"
            alt="Register Illustration"
            width={150}
            height={150}
            priority
          />
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-[#EF5A5A] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 h-1 ${
                      currentStep > step ? "bg-[#EF5A5A]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {renderStep()}

          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1"
              >
                Kembali
              </Button>
            )}
            
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-[#EF5A5A] hover:bg-[#d94545] text-white"
                disabled={!validateStep(currentStep)}
              >
                Lanjut
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 bg-[#EF5A5A] hover:bg-[#d94545] text-white"
                disabled={isLoading || !validateStep(4)}
              >
                {isLoading ? "Mendaftar..." : "Daftar"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
