"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import CloudinaryUploader, { CloudinaryUploadResult } from "@/components/CloudinaryUploader";
import { FranchisorRegistrationPayload } from "@/type/registration";
import { FileUploadResult } from "@/utils/fileUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import withAuth from "@/lib/withAuth";

function FranchisorRegisterPage() {
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
    location: "",
    ownership_document: "",
    financial_statement: "",
    proposal: "",
    sales_location: "",
    equipment: "",
    materials: "",
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [highlights, setHighlights] = useState([
    { title: "", content: "" }
  ]);

  const [documents, setDocuments] = useState([
    { name: "", path: "", type: "PENDUKUNG" as "PENDUKUNG" | "GUIDELINES" }
  ]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 4;

  useEffect(() => {
    // Basic validation
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Semua field wajib diisi");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Format email tidak valid");
      } else if (formData.password.length < 6) {
        setError("Password minimal 6 karakter");
      } else if (formData.password !== formData.confirmPassword) {
        setError("Password dan konfirmasi tidak cocok");
      } else {
        setError("");
      }
    } else if (currentStep === 2) {
      if (!formData.ktp || !formData.ownership_document || !formData.financial_statement || !formData.proposal) {
        setError("Semua dokumen wajib diupload");
      } else {
        setError("");
      }
    } else if (currentStep === 3) {
      if (!formData.franchiseName || !formData.price || !formData.location || !formData.foto_diri || !formData.image || selectedCategories.length === 0) {
        setError("Informasi brand, gambar, dan kategori wajib diisi");
      } else {
        setError("");
      }
    } else if (currentStep === 4) {
      if (!formData.sales_location || !formData.equipment || !formData.materials) {
        setError("Detail bisnis wajib diisi");
      } else {
        const hasEmptyHighlight = highlights.some(h => !h.title || !h.content);
        if (hasEmptyHighlight) {
          setError("Semua highlight wajib diisi");
        } else {
          setError("");
        }
      }
    }
  }, [formData, highlights, documents, currentStep, selectedCategories]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFileUpload = (field: string) => (result: FileUploadResult | CloudinaryUploadResult) => {
    console.log("Upload result for field", field, ":", result);
    if (result.success) {
      let fileUrl: string | undefined;
      
      // Handle both CloudinaryUploadResult and FileUploadResult
      if ('url' in result && result.url) {
        fileUrl = result.url;
      } else if ('path' in result && result.path) {
        fileUrl = result.path;
      }
      
      if (fileUrl) {
        updateField(field, fileUrl);
        console.log("File uploaded successfully for", field, "url:", fileUrl);
      }
    } else {
      console.error("Upload failed for field", field, "error:", result.error);
    }
  };

  const addHighlight = () => {
    setHighlights([...highlights, { title: "", content: "" }]);
  };

  const removeHighlight = (index: number) => {
    if (highlights.length > 1) {
      setHighlights(highlights.filter((_, i) => i !== index));
    }
  };

  const updateHighlight = (index: number, field: "title" | "content", value: string) => {
    const updated = [...highlights];
    updated[index][field] = value;
    setHighlights(updated);
  };

  const addDocument = () => {
    setDocuments([...documents, { name: "", path: "", type: "PENDUKUNG" }]);
  };

  const removeDocument = (index: number) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  const updateDocument = (index: number, field: keyof typeof documents[0], value: string) => {
    const updated = [...documents];
    if (field === "type" && (value === "PENDUKUNG" || value === "GUIDELINES")) {
      updated[index][field] = value;
    } else if (field !== "type") {
      updated[index][field] = value;
    }
    setDocuments(updated);
  };

  const handleDocumentUpload = (index: number) => (result: FileUploadResult | CloudinaryUploadResult) => {
    if (result.success) {
      let fileUrl: string | undefined;
      
      // Handle both CloudinaryUploadResult and FileUploadResult
      if ('url' in result && result.url) {
        fileUrl = result.url;
      } else if ('path' in result && result.path) {
        fileUrl = result.path;
      }
      
      if (fileUrl) {
        updateDocument(index, "path", fileUrl);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && !error) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (error) return;

    setIsLoading(true);

    const payload: FranchisorRegistrationPayload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      franchisor_data: {
        ktp: formData.ktp,
        foto_diri: formData.foto_diri,
      },
      franchise_data: {
        category_id: selectedCategories,
        name: formData.franchiseName,
        price: parseFloat(formData.price),
        image: formData.image,
        location: formData.location,
        ownership_document: formData.ownership_document,
        financial_statement: formData.financial_statement,
        proposal: formData.proposal,
        sales_location: formData.sales_location,
        equipment: formData.equipment,
        materials: formData.materials,
        listing_highlights: highlights,
        listing_documents: documents,
        status: ""
      },
    };

    try {
      const res = await fetch("/api/register/franchisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrasi gagal.");
        return;
      }

      setDialogOpen(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">Informasi Akun</h2>
            
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
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="••••••"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="••••••"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">Upload Dokumen</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="ktp-upload" className="text-sm font-medium">Scan KTP</Label>
                <CloudinaryUploader
                  id="ktp-upload"
                  title="Pilih File KTP"
                  onUploadComplete={handleFileUpload("ktp")}
                  acceptedTypes={["jpg", "jpeg", "png", "pdf"]}
                  maxSizeMB={5}
                  currentUrl={formData.ktp || ""}
                />
              </div>

              <div>
                <Label htmlFor="ownership-upload" className="text-sm font-medium">Bukti Kepemilikan</Label>
                <CloudinaryUploader
                  id="ownership-upload"
                  title="Pilih File Bukti Kepemilikan"
                  onUploadComplete={handleFileUpload("ownership_document")}
                  acceptedTypes={["pdf", "jpg", "jpeg", "png"]}
                  maxSizeMB={10}
                  currentUrl={formData.ownership_document || ""}
                />
              </div>

              <div>
                <Label htmlFor="financial-upload" className="text-sm font-medium">Laporan Keuangan</Label>
                <CloudinaryUploader
                  id="financial-upload"
                  title="Pilih File Laporan Keuangan"
                  onUploadComplete={handleFileUpload("financial_statement")}
                  acceptedTypes={["pdf", "jpg", "jpeg", "png"]}
                  maxSizeMB={10}
                  currentUrl={formData.financial_statement || ""}
                />
              </div>

              <div>
                <Label htmlFor="proposal-upload" className="text-sm font-medium">Proposal</Label>
                <CloudinaryUploader
                  id="proposal-upload"
                  title="Pilih File Proposal"
                  onUploadComplete={handleFileUpload("proposal")}
                  acceptedTypes={["pdf", "jpg", "jpeg", "png"]}
                  maxSizeMB={10}
                  currentUrl={formData.proposal || ""}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">Informasi Brand & Pemilik</h2>
            
            <div className="space-y-2">
              <Label htmlFor="franchiseName">Nama Brand</Label>
              <Input
                id="franchiseName"
                value={formData.franchiseName}
                onChange={(e) => updateField("franchiseName", e.target.value)}
                placeholder="Masukkan nama brand/franchise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi Pusat</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Contoh: Jl. Danau Ranau, Kota Malang"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Harga Franchise (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="Masukkan harga franchise"
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Kategori Franchise</Label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => toggleCategory("fa3a59bb-b003-4c27-9497-c2f3e333cabc")}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedCategories.includes("fa3a59bb-b003-4c27-9497-c2f3e333cabc")
                      ? "border-[#EF5A5A] bg-[#EF5A5A]/10 text-[#EF5A5A]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🍽️</div>
                    <div className="font-medium">Food</div>
                  </div>
                </div>
                
                <div 
                  onClick={() => toggleCategory("a9c1ec53-5f65-4b67-b7f2-731e61a97a57")}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedCategories.includes("a9c1ec53-5f65-4b67-b7f2-731e61a97a57")
                      ? "border-[#EF5A5A] bg-[#EF5A5A]/10 text-[#EF5A5A]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🥤</div>
                    <div className="font-medium">Beverage</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">Pilih satu atau lebih kategori</p>
            </div>

            <div>
              <Label htmlFor="foto-diri-upload" className="text-sm font-medium">Foto Diri Pemilik</Label>
              <CloudinaryUploader
                id="foto-diri-upload"
                title="Pilih Foto Diri"
                onUploadComplete={handleFileUpload("foto_diri")}
                acceptedTypes={["jpg", "jpeg", "png"]}
                maxSizeMB={5}
                currentUrl={formData.foto_diri || ""}
              />
            </div>

            <div>
              <Label htmlFor="franchise-image-upload" className="text-sm font-medium">Gambar Brand/Produk</Label>
              <CloudinaryUploader
                id="franchise-image-upload"
                title="Pilih Gambar Brand"
                onUploadComplete={handleFileUpload("image")}
                acceptedTypes={["jpg", "jpeg", "png"]}
                maxSizeMB={5}
                currentUrl={formData.image || ""}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center mb-4">Detail Bisnis & Keunggulan</h2>
            
            {/* Detail Bisnis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detail Bisnis</h3>
              
              <div className="space-y-2">
                <Label htmlFor="sales_location">Lokasi Penjualan</Label>
                <textarea
                  id="sales_location"
                  value={formData.sales_location}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("sales_location", e.target.value)}
                  placeholder="Deskripsikan lokasi penjualan yang cocok"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF5A5A] focus:border-transparent resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Peralatan yang Disediakan</Label>
                <textarea
                  id="equipment"
                  value={formData.equipment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("equipment", e.target.value)}
                  placeholder="Sebutkan peralatan yang akan disediakan"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF5A5A] focus:border-transparent resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materials">Bahan Baku & Supply</Label>
                <textarea
                  id="materials"
                  value={formData.materials}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("materials", e.target.value)}
                  placeholder="Jelaskan sistem supply bahan baku"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF5A5A] focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Keunggulan Franchise</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHighlight}
                  className="text-[#EF5A5A]"
                >
                  <Plus size={16} className="mr-1" /> Tambah
                </Button>
              </div>

              {highlights.map((highlight, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Keunggulan #{index + 1}</Label>
                    {highlights.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHighlight(index)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <Input
                    placeholder="Judul keunggulan"
                    value={highlight.title}
                    onChange={(e) => updateHighlight(index, "title", e.target.value)}
                  />
                  
                  <textarea
                    placeholder="Deskripsi keunggulan"
                    value={highlight.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateHighlight(index, "content", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF5A5A] focus:border-transparent resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Dokumen Pendukung */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Dokumen Pendukung</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDocument}
                  className="text-[#EF5A5A]"
                >
                  <Plus size={16} className="mr-1" /> Tambah
                </Button>
              </div>

              {documents.map((document, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Dokumen #{index + 1}</Label>
                    {documents.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <Input
                    placeholder="Nama dokumen"
                    value={document.name}
                    onChange={(e) => updateDocument(index, "name", e.target.value)}
                  />
                  
                  <CloudinaryUploader
                    id={`document-${index}-upload`}
                    title="Upload Dokumen"
                    onUploadComplete={handleDocumentUpload(index)}
                    acceptedTypes={["pdf", "jpg", "jpeg", "png"]}
                    currentUrl={document.path || ""}
                  />
                </div>
              ))}
            </div>
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
              Pendaftaran franchisor berhasil. Data Anda akan diverifikasi oleh admin. 
              Anda akan diarahkan ke halaman login.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-lg p-6 shadow-xl rounded-2xl border border-gray-200">
        <div className="flex justify-center mb-4">
          <Image
            src="/image/auth/register.png"
            alt="Register Illustration"
            width={200}
            height={200}
            priority
          />
        </div>

        <div className="mb-6">
          <h1 className="text-center text-2xl font-bold text-black mb-2">
            Daftar Sebagai Franchisor
          </h1>
          <div className="flex justify-center space-x-2 mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full ${
                  i + 1 <= currentStep ? "bg-[#EF5A5A]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Langkah {currentStep} dari {totalSteps}
          </p>
        </div>

        <div className="space-y-4">
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          
          {renderStep()}

          <div className="flex space-x-3 pt-4">
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
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!!error}
                className="flex-1 bg-[#EF5A5A] text-white hover:bg-[#e44d4d] disabled:opacity-50"
              >
                Lanjut
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!!error || isLoading}
                className="flex-1 bg-[#EF5A5A] text-white hover:bg-[#e44d4d] disabled:opacity-50"
              >
                {isLoading ? "Mendaftar..." : "Daftar"}
              </Button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[#EF5A5A] cursor-pointer hover:underline"
            >
              Masuk di sini
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default withAuth(FranchisorRegisterPage, "GUEST");
