"use client";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import StepOne from "./components/StepOne";
import { Progress } from "@/components/ui/progress";
import StepTwo from "./components/StepTwo";
import StepFour from "./components/StepFour";
import StepFive from "./components/StepFive";
import StepSix from "./components/StepSix";
import StepEight from "./components/StepEight";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import CloudinaryUploader, { CloudinaryUploadResult } from "@/components/CloudinaryUploader";
import withAuth from "@/lib/withAuth";
import { User } from "@/type/user";
import { PurchaseFranchisePayload } from "@/type/franchise";
import { FileUploadResult } from "@/utils/fileUtils";
import axios from "axios";
import { toast } from "sonner";

interface RequestFundingPageProps {
  user?: User | null;
  params: Promise<{ franchiseId: string }>;
}

// Form data interface
interface FormData {
  namaLengkap: string;
  email: string;
  alamatTempat: string;
  noTelepon: string;
  npwp: string;
  alamatFranchise: string;
  ktp: string;
  foto_diri: string;
  foto_franchise: string;
  mou_franchisor: string;
  mou_modal: string;
}

// StepThreeForm dan StepSevenForm sebagai komponen function di luar komponen utama
type StepFormProps = {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handleFileUpload: (field: keyof FormData) => (result: FileUploadResult | CloudinaryUploadResult) => void;
};
function StepThreeForm({ formData, handleInputChange, handleFileUpload }: StepFormProps) {
  return (
    <div className="mt-4 w-full space-y-6">
      <h1 className="text-xl font-semibold text-black mb-6">Formulir Pendaftaran</h1>
      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <Label htmlFor="namaLengkap" className="text-sm font-medium text-black">Nama Lengkap</Label>
          <Input id="namaLengkap" placeholder="Dwiyanto Putra" value={formData.namaLengkap} onChange={e => handleInputChange("namaLengkap", e.target.value)} className="bg-gray-100 border-none" />
        </div>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-black">Email</Label>
          <Input id="email" type="email" placeholder="Dwiyanto28@email.com" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} className="bg-gray-100 border-none" />
        </div>
        {/* Alamat Tempat Tinggal */}
        <div className="space-y-2">
          <Label htmlFor="alamatTempat" className="text-sm font-medium text-black">Alamat Tempat Tinggal</Label>
          <Input id="alamatTempat" placeholder="Jalan Aja Dulu" value={formData.alamatTempat} onChange={e => handleInputChange("alamatTempat", e.target.value)} className="bg-gray-100 border-none" />
        </div>
        {/* No Telepon */}
        <div className="space-y-2">
          <Label htmlFor="noTelepon" className="text-sm font-medium text-black">No Telepon</Label>
          <Input id="noTelepon" placeholder="082327184928" value={formData.noTelepon} onChange={e => handleInputChange("noTelepon", e.target.value)} className="bg-gray-100 border-none" />
        </div>
        {/* NPWP */}
        <div className="space-y-2">
          <Label htmlFor="npwp" className="text-sm font-medium text-black">NPWP</Label>
          <Input id="npwp" placeholder="XXXXXXXXXX" value={formData.npwp} onChange={e => handleInputChange("npwp", e.target.value)} className="bg-gray-100 border-none" />
        </div>
        {/* Alamat Lokasi Franchise */}
        <div className="space-y-2">
          <Label htmlFor="alamatFranchise" className="text-sm font-medium text-black">Alamat Lokasi Franchise</Label>
          <Input id="alamatFranchise" placeholder="Jalan Aja Dulu" value={formData.alamatFranchise} onChange={e => handleInputChange("alamatFranchise", e.target.value)} className="bg-gray-100 border-none" />
        </div>
        {/* Scan KTP */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Scan KTP</Label>
          <CloudinaryUploader key={formData.ktp} id="scan-ktp" title="Upload Scan KTP" onUploadComplete={handleFileUpload("ktp")} currentUrl={formData.ktp || ""} maxSizeMB={5} acceptedTypes={["png", "jpg", "jpeg"]} />
        </div>
        {/* Upload Foto Diri */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Upload Foto Diri</Label>
          <CloudinaryUploader key={formData.foto_diri} id="foto-diri" title="Upload Foto Diri" onUploadComplete={handleFileUpload("foto_diri")} currentUrl={formData.foto_diri || ""} maxSizeMB={5} acceptedTypes={["png", "jpg", "jpeg"]} />
        </div>
        {/* Upload Foto Lokasi Franchise */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Upload Foto Lokasi Franchise</Label>
          <CloudinaryUploader key={formData.foto_franchise} id="foto-franchise" title="Upload Foto Lokasi Franchise" onUploadComplete={handleFileUpload("foto_franchise")} currentUrl={formData.foto_franchise || ""} maxSizeMB={5} acceptedTypes={["png", "jpg", "jpeg"]} />
        </div>
      </div>
    </div>
  );
}

type StepSevenFormProps = {
  formData: FormData;
  handleFileUpload: (field: keyof FormData) => (result: FileUploadResult | CloudinaryUploadResult) => void;
  handleDownload: (type: string) => void;
};
function StepSevenForm({ formData, handleFileUpload, handleDownload }: StepSevenFormProps) {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold text-black mb-6">Tanda Tangan Perjanjian</h1>
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">FundChise akan melindungi hak anda sebagai franchisee dan melindungi hak franchisor. Tanda tangani dokumen perjanjian berikut untuk kebaikan kedua pihak.</p>
        <p className="text-sm text-orange-500 font-medium">Tanda tangan harus disertai materai Rp. 10.000</p>
        {/* Download Buttons */}
        <div className="space-y-3">
          <Button onClick={() => handleDownload("MoU Franchisor")} className="w-full bg-orange-400 hover:bg-orange-500 text-white flex items-center justify-center gap-2 py-3"><Download className="w-4 h-4" />Unduh Dokumen MoU Franchisor</Button>
          <Button onClick={() => handleDownload("MoU Modal")} className="w-full bg-orange-400 hover:bg-orange-500 text-white flex items-center justify-center gap-2 py-3"><Download className="w-4 h-4" />Unduh Dokumen MoU Modal</Button>
        </div>
        {/* Upload MoU Franchisor */}
        <div className="space-y-2 mt-8">
          <Label className="text-sm font-medium text-black">Upload Dokumen MoU Franchisor</Label>
          <CloudinaryUploader key={formData.mou_franchisor} id="mou-franchisor" title="Upload Dokumen MoU Franchisor" onUploadComplete={handleFileUpload("mou_franchisor")} currentUrl={formData.mou_franchisor || ""} maxSizeMB={10} acceptedTypes={["pdf", "doc", "docx", "png", "jpg", "jpeg"]} />
        </div>
        {/* Upload MoU Modal */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Upload Dokumen MoU Modal</Label>
          <CloudinaryUploader key={formData.mou_modal} id="mou-modal" title="Upload Dokumen MoU Modal" onUploadComplete={handleFileUpload("mou_modal")} currentUrl={formData.mou_modal || ""} maxSizeMB={10} acceptedTypes={["pdf", "doc", "docx", "png", "jpg", "jpeg"]} />
        </div>
      </div>
    </div>
  );
}

function RequestFundingPage({ user, params }: RequestFundingPageProps) {
  const { franchiseId } = use(params);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConditionalSteps, setShowConditionalSteps] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "",
    email: "",
    alamatTempat: "",
    noTelepon: "",
    npwp: "",
    alamatFranchise: "",
    ktp: "",
    foto_diri: "",
    foto_franchise: "",
    mou_franchisor: "",
    mou_modal: "",
  });

  // Pre-fill user data if available
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        namaLengkap: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Handler input
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  // Handler upload file
  const handleFileUpload = (field: keyof FormData) => (result: FileUploadResult | CloudinaryUploadResult) => {
    if (result.success) {
      let fileUrl: string | undefined;
      if ('url' in result && result.url) fileUrl = result.url;
      else if ('path' in result && result.path) fileUrl = result.path;
      if (fileUrl) setFormData(prev => ({ ...prev, [field]: fileUrl }));
    }
  };

  const handleDownload = (documentType: string) => {
    // Handle document download logic here
    console.log(`Downloading ${documentType}`);
    toast.info(`Mengunduh ${documentType}...`);
  };

  const submitFundingRequest = async () => {
    try {
      setIsLoading(true);
      const payload: PurchaseFranchisePayload = {
        purchase_type: "FUNDED",
        confirmation_status: "WAITING",
        payment_status: "PROCESSED",
        funding_request: {
          confirmation_status: "WAITING",
          address: formData.alamatTempat,
          phone_number: formData.noTelepon,
          npwp: formData.npwp,
          franchise_address: formData.alamatFranchise,
          ktp: formData.ktp || "ktp_dummy.jpg",
          foto_diri: formData.foto_diri || "foto_diri_dummy.jpg",
          foto_lokasi: formData.foto_franchise || "foto_lokasi_dummy.jpg",
          mou_franchisor: formData.mou_franchisor || "mou_franchisor_dummy.pdf",
          mou_modal: formData.mou_modal || "mou_modal_dummy.pdf",
        },
      };

      // Submit to API
      const response = await axios.post(
        `/api/franchises/${franchiseId}/purchase`,
        payload
      );

      if (response.data.status) {
        toast.success("Permohonan pendanaan berhasil dikirim!");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to submit");
      }
    } catch (error: unknown) {
      console.error("Submit error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengirim permohonan";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Show submit dialog for StepThree
      setShowSubmitDialog(true);
      return;
    }

    if (currentStep === 7) {
      // Show send dialog for StepSeven
      setShowSendDialog(true);
      return;
    }

    if (currentStep === 8) {
      // Progress to StepNine
      setCurrentStep(currentStep + 1);
      return;
    }

    if (currentStep === 9) {
      // Navigate to franchisee home
      router.push("/franchisee/franchise");
      return;
    }

    // Normal progression
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      // After step 6, check if conditional steps should be shown
      setShowConditionalSteps(true);
      setCurrentStep(7); // Jump to step 7 (conditional steps don't use progress bar)
    } else if (showConditionalSteps) {
      // Handle progression through conditional steps 7-9
      if (currentStep < 9) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitConfirm = async () => {
    setShowSubmitDialog(false);

    // Validate form data
    if (
      !formData.namaLengkap ||
      !formData.alamatTempat ||
      !formData.noTelepon ||
      !formData.npwp ||
      !formData.alamatFranchise
    ) {
      toast.error("Mohon lengkapi semua field yang wajib");
      return;
    }

    if (!formData.ktp || !formData.foto_diri || !formData.foto_franchise) {
      toast.error("Mohon upload semua dokumen yang diperlukan");
      return;
    }

    const success = await submitFundingRequest();
    if (success) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSendConfirm = async () => {
    setShowSendDialog(false);

    if (!formData.mou_franchisor || !formData.mou_modal) {
      toast.error("Mohon upload kedua dokumen MoU yang telah ditandatangani");
      return;
    }

    // In a real implementation, you might want to update the funding request
    // with the signed MoU documents
    toast.success("Dokumen MoU berhasil dikirim!");
    setCurrentStep(currentStep + 1);
  };

  // Integrated Form Component for Step 3
  // Adding key console logs to help debug the file upload issue
  React.useEffect(() => {
    console.log("Current uploaded files state:", formData);
  }, [formData]);

  const getButtonText = () => {
    switch (currentStep) {
      case 3:
        return "Submit";
      case 4:
      case 5:
        return "Lihat Detail";
      case 6:
        return "Selanjutnya";
      case 7:
        return "Kirim";
      case 8:
        return "Kembali ke Home";
      case 9:
        return "Cek My Franchise";
      default:
        return "Selanjutnya";
    }
  };

  const showBackButton = () => {
    return currentStep === 2 || currentStep === 3;
  };

  function StepNineRedirect() {
    const router = useRouter();
    React.useEffect(() => {
      router.push("/franchisee/franchise");
    }, [router]);
    return null;
  }

  // Render step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThreeForm formData={formData} handleInputChange={handleInputChange} handleFileUpload={handleFileUpload} />;
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive />;
      case 6:
        return <StepSix />;
      case 7:
        return <StepSevenForm formData={formData} handleFileUpload={handleFileUpload} handleDownload={handleDownload} />;
      case 8:
        return <StepEight />;
      case 9:
        return <StepNineRedirect />;
      default:
        return <StepOne />;
    }
  };

  return (
    <AppLayout showBottomNav={false} className="text-black">
      <Button
        variant="secondary"
        size="icon"
        className="size-8 mt-8 mb-2"
        onClick={() => router.back()}
      >
        <ArrowLeft />
      </Button>
      <section className="mb-12 px-4 flex min-h-screen h-auto w-full items-center justify-start flex-col">
        {/* Show progress bar only for steps 2-6, but map to progress steps 1-5 */}
        {!showConditionalSteps && currentStep >= 2 && currentStep <= 6 && (
          <Progress variant="steps" steps={5} currentStep={currentStep - 1} />
        )}

        {/* Render the current step */}
        {renderCurrentStep()}

        {/* Button Section */}
        <div className="w-full flex gap-3 mt-6">
          {showBackButton() && (
            <Button variant="outline" className="flex-1" onClick={handleBack}>
              Kembali
            </Button>
          )}
          <Button
            className={`${
              showBackButton() ? "flex-1" : "w-full"
            } bg-[#EF5A5A] hover:bg-[#e44d4d]`}
            onClick={handleNext}
            disabled={isLoading}
          >
            {getButtonText()}
          </Button>
        </div>

        {/* Submit Dialog for StepThree */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Submit</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin mengirim formulir pendaftaran ini?
                Pastikan semua data yang diisi sudah benar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmitConfirm}
                className="bg-[#EF5A5A] hover:bg-[#e44d4d]"
              >
                Ya, Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Send Dialog for StepSeven */}
        <AlertDialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Kirim Dokumen</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin mengirim dokumen MoU yang telah
                ditandatangani? Pastikan dokumen sudah diisi dengan benar dan
                dilengkapi materai.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSendConfirm}
                className="bg-[#EF5A5A] hover:bg-[#e44d4d]"
              >
                Ya, Kirim
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </AppLayout>
  );
}

export default withAuth(RequestFundingPage, "FRANCHISEE");
