"use client";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import React, { useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import StepOne from "./components/StepOne";
import { Progress } from "@/components/ui/progress";
import StepTwo from "./components/StepTwo";
import StepFour from "./components/StepFour";
import StepFive from "./components/StepFive";
import StepSix from "./components/StepSix";
import StepEight from "./components/StepEight";
import StepNine from "./components/StepNine";
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
import CloudinaryUploader, {
  CloudinaryUploadResult,
} from "@/components/CloudinaryUploader";
import withAuth from "@/lib/withAuth";
import useAuthStore from "@/store/authStore";
import { PurchaseFranchisePayload } from "@/type/franchise";
import { FileUploadResult } from "@/utils/fileUtils";
import axios from "axios";
import { toast } from "sonner";

// Franchisee franchises API response interfaces
interface FranchiseePurchase {
  id: string;
  user_id: string;
  franchise_id: string;
  purchase_type: "PURCHASED" | "FUNDED";
  confirmation_status: "WAITING" | "INTERVIEW" | "ACCEPTED";
  payment_status: "PENDING" | "PAID" | "PROCESSED";
  paid_at: string | null;
  funding_request?: {
    id: string;
    confirmation_status: "WAITING" | "INTERVIEW" | "ACCEPTED";
    address: string;
    phone_number: string;
    npwp: string;
    franchise_address: string;
    ktp: string;
    foto_diri: string;
    foto_lokasi: string;
    mou_franchisor?: string;
    mou_modal?: string;
  };
}

// Form data interface
interface FormData {
  namaLengkap: string;
  email: string;
  alamatTempat: string;
  noTelepon: string;
  npwp: string;
  alamatFranchise: string;
}

// File upload paths interface
interface FilePaths {
  scanKTP: string;
  fotoDiri: string;
  fotoFranchise: string;
  mouFranchisor: string;
  mouModal: string;
}

// Remove the interface and use a simple approach
function RequestFundingPage({ params }: { params: Promise<{ franchiseId: string }> }) {
  const { franchiseId } = use(params);
  const router = useRouter();
  const user = useAuthStore.useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConditionalSteps, setShowConditionalSteps] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [existingPurchase, setExistingPurchase] =
    useState<FranchiseePurchase | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Agreement state for Step 2 - Use Case 3.1
  const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);

  // State to store complete funding request data for PUT operation
  const [completeFundingData, setCompleteFundingData] = useState<{
    address: string;
    phone_number: string;
    npwp: string;
    franchise_address: string;
    ktp: string;
    foto_diri: string;
    foto_lokasi: string;
    mou_franchisor?: string;
    mou_modal?: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "",
    email: "",
    alamatTempat: "",
    noTelepon: "",
    npwp: "",
    alamatFranchise: "",
  });

  const [filePaths, setFilePaths] = useState<FilePaths>({
    scanKTP: "",
    fotoDiri: "",
    fotoFranchise: "",
    mouFranchisor: "",
    mouModal: "",
  });

  // Debug: Log filePaths changes
  React.useEffect(() => {
    console.log("FilePaths updated:", filePaths);
  }, [filePaths]);

  // Debug: Log completeFundingData changes
  React.useEffect(() => {
    console.log("=== CompleteFundingData updated ===", completeFundingData);
  }, [completeFundingData]);

  // Debug: Log currentStep changes to track unwanted step resets
  React.useEffect(() => {
    console.log("=== CurrentStep changed ===", {
      newStep: currentStep,
      timestamp: new Date().toISOString(),
    });
  }, [currentStep]);

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

  // Fetch profile data to ensure we have address and phone_number for MoU updates
  const fetchProfileData = useCallback(async () => {
    try {
      console.log("=== Fetching franchisee profile data ===");
      const response = await axios.get("/api/franchisee/profile", {
        withCredentials: true,
      });

      if (response.data.success && response.data.data) {
        const { user: userData, profile: profileData } = response.data.data;
        console.log("=== Profile data fetched successfully ===", {
          userData,
          profileData,
        });

        // Check if profile data exists (profile might be null if no funding_request exists yet)
        if (profileData) {
          // Store critical fields in completeFundingData and formData
          const profileAddress = profileData.address || "";
          const profilePhoneNumber = profileData.phone_number || "";

          // Update completeFundingData with profile data
          setCompleteFundingData((prev) => ({
            ...prev,
            address: profileAddress,
            phone_number: profilePhoneNumber,
            npwp: profileData.npwp || prev?.npwp || "",
            franchise_address:
              profileData.franchise_address || prev?.franchise_address || "",
            ktp: profileData.ktp || prev?.ktp || "",
            foto_diri: profileData.foto_diri || prev?.foto_diri || "",
            foto_lokasi: profileData.foto_lokasi || prev?.foto_lokasi || "",
            mou_franchisor:
              profileData.mou_franchisor || prev?.mou_franchisor || "",
            mou_modal: profileData.mou_modal || prev?.mou_modal || "",
          }));

          // Also update formData with profile data
          setFormData((prev) => ({
            ...prev,
            namaLengkap: userData?.name || user?.name || prev.namaLengkap,
            email: userData?.email || user?.email || prev.email,
            alamatTempat: profileAddress || prev.alamatTempat,
            noTelepon: profilePhoneNumber || prev.noTelepon,
            npwp: profileData.npwp || prev.npwp,
            alamatFranchise:
              profileData.franchise_address || prev.alamatFranchise,
          }));

          console.log("=== Profile data stored in state ===", {
            address: profileAddress,
            phone_number: profilePhoneNumber,
            hasProfileData: !!profileData,
          });
        } else {
          console.log("=== No profile data found (no funding_request yet) ===");
          // Still update user basic info if available
          if (userData) {
            setFormData((prev) => ({
              ...prev,
              namaLengkap: userData.name || user?.name || prev.namaLengkap,
              email: userData.email || user?.email || prev.email,
            }));
          }
        }
      }
    } catch (error) {
      console.log("=== Failed to fetch profile data ===", error);
      // This is not critical, user can still fill the form manually
    }
  }, [user]);

  // Check for existing franchise purchase and determine the correct step
  const checkExistingPurchase = useCallback(async () => {
    setIsCheckingStatus(true);
    try {
      console.log("=== Getting data from /api/franchisee/franchises ===");
      // Get all franchisee's franchise purchases
      const response = await axios.get("/api/franchisee/franchises", {
        withCredentials: true,
      });

      if (response.data.status && response.data.data) {
        // Find purchase for current franchise
        const existingPurchase = response.data.data.find(
          (purchase: FranchiseePurchase) =>
            purchase.franchise_id === franchiseId
        );

        // Case 1: No franchise found with current franchiseId -> StepOne
        if (!existingPurchase) {
          console.log(
            "=== No existing purchase found - directing to StepOne ==="
          );
          setCurrentStep(1);
          setExistingPurchase(null);
          return;
        }

        // Found existing purchase
        setExistingPurchase(existingPurchase);
        console.log("=== Found existing purchase ===", existingPurchase);

        // If we have funding_request data, populate completeFundingData
        if (existingPurchase.funding_request) {
          const fundingData = existingPurchase.funding_request;
          console.log(
            "=== Found funding data in existingPurchase ===",
            fundingData
          );

          // Merge funding data from /api/franchisee/franchises with existing profile data
          setCompleteFundingData((prev) => ({
            address: fundingData.address || prev?.address || "",
            phone_number: fundingData.phone_number || prev?.phone_number || "",
            npwp: fundingData.npwp || prev?.npwp || "",
            franchise_address:
              fundingData.franchise_address || prev?.franchise_address || "",
            ktp: fundingData.ktp || prev?.ktp || "",
            foto_diri: fundingData.foto_diri || prev?.foto_diri || "",
            foto_lokasi: fundingData.foto_lokasi || prev?.foto_lokasi || "",
            mou_franchisor:
              fundingData.mou_franchisor || prev?.mou_franchisor || "",
            mou_modal: fundingData.mou_modal || prev?.mou_modal || "",
          }));

          // Populate form data
          setFormData((prev) => ({
            ...prev,
            alamatTempat: fundingData.address || prev.alamatTempat,
            noTelepon: fundingData.phone_number || prev.noTelepon,
            npwp: fundingData.npwp || prev.npwp,
            alamatFranchise:
              fundingData.franchise_address || prev.alamatFranchise,
          }));

          // Populate file paths if they exist
          setFilePaths((prev) => ({
            ...prev,
            scanKTP: fundingData.ktp || prev.scanKTP,
            fotoDiri: fundingData.foto_diri || prev.fotoDiri,
            fotoFranchise: fundingData.foto_lokasi || prev.fotoFranchise,
            mouFranchisor: fundingData.mou_franchisor || prev.mouFranchisor,
            mouModal: fundingData.mou_modal || prev.mouModal,
          }));
        }

        // Case 2: Check funding_request.confirmation_status and determine step
        if (existingPurchase.funding_request) {
          const fundingStatus =
            existingPurchase.funding_request.confirmation_status;
          const mouFranchisor = existingPurchase.funding_request.mou_franchisor;
          const mouModal = existingPurchase.funding_request.mou_modal;

          console.log("=== Funding request status check ===", {
            fundingStatus,
            hasMouFranchisor: !!mouFranchisor && mouFranchisor !== "",
            hasMouModal: !!mouModal && mouModal !== "",
            mouFranchisor,
            mouModal,
          });

          switch (fundingStatus) {
            case "WAITING":
              // Check if MOU documents exist
              if (
                mouFranchisor &&
                mouFranchisor !== "" &&
                mouModal &&
                mouModal !== ""
              ) {
                console.log(
                  "=== Status WAITING with MOU documents - directing to StepEight ==="
                );
                setCurrentStep(8);
              } else {
                console.log(
                  "=== Status WAITING without MOU - directing to StepFour ==="
                );
                setCurrentStep(4);
              }
              break;

            case "INTERVIEW":
              // Check if MOU documents exist
              if (
                mouFranchisor &&
                mouFranchisor !== "" &&
                mouModal &&
                mouModal !== ""
              ) {
                console.log(
                  "=== Status INTERVIEW with MOU documents - directing to StepEight ==="
                );
                setCurrentStep(8);
              } else {
                console.log(
                  "=== Status INTERVIEW without MOU - directing to StepFive ==="
                );
                setCurrentStep(5);
              }
              break;

            case "ACCEPTED":
              // Check if both MOU documents are empty
              if (
                (!mouFranchisor || mouFranchisor === "") &&
                (!mouModal || mouModal === "")
              ) {
                console.log(
                  "=== Status ACCEPTED with empty MOU documents - directing to StepSix ==="
                );
                setCurrentStep(6);
              } else {
                // Both MOU documents have content, check the main confirmation_status
                const mainConfirmationStatus =
                  existingPurchase.confirmation_status;
                console.log(
                  "=== MOU documents exist, checking main confirmation_status ===",
                  {
                    mainConfirmationStatus,
                    mouFranchisor,
                    mouModal,
                  }
                );

                if (mainConfirmationStatus === "WAITING") {
                  console.log(
                    "=== Main status WAITING with MOU documents - directing to StepEight ==="
                  );
                  setCurrentStep(8);
                } else if (mainConfirmationStatus === "ACCEPTED") {
                  console.log(
                    "=== Main status ACCEPTED with MOU documents - directing to StepNine ==="
                  );
                  setCurrentStep(9);
                } else if (mainConfirmationStatus === "INTERVIEW") {
                  console.log(
                    "=== Main status INTERVIEW with MOU documents - directing to StepEight ==="
                  );
                  setCurrentStep(8);
                } else {
                  // Fallback to StepSix if unclear
                  console.log(
                    "=== Unclear status with MOU documents - directing to StepSix ==="
                  );
                  setCurrentStep(6);
                }
              }
              break;

            default:
              console.log(
                "=== Unknown funding status - directing to StepOne ==="
              );
              setCurrentStep(1);
              break;
          }
        } else {
          // No funding_request but existing purchase found - direct to StepOne to start funding request
          console.log(
            "=== Existing purchase without funding_request - directing to StepOne ==="
          );
          setCurrentStep(1);
        }
      } else {
        // No data found - direct to StepOne
        console.log("=== No franchise data found - directing to StepOne ===");
        setCurrentStep(1);
        setExistingPurchase(null);
      }
    } catch (error) {
      console.log(
        "=== Error checking purchase, directing to StepOne ===",
        error
      );
      setCurrentStep(1);
      setExistingPurchase(null);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [franchiseId]);

  // Check for existing purchase on component mount
  React.useEffect(() => {
    // Only initialize once to prevent re-renders when step changes
    if (!isInitialized) {
      const initializeData = async () => {
        await fetchProfileData();
        await checkExistingPurchase();
        setIsInitialized(true);
      };
      initializeData();
    }
  }, [isInitialized, fetchProfileData, checkExistingPurchase]);

  // Utility function to validate Cloudinary URLs
  const validateCloudinaryUrl = useCallback((url: string) => {
    return (
      url &&
      (url.startsWith("http") || url.startsWith("https")) &&
      !url.includes("_dummy") &&
      (url.includes("cloudinary.com") || url.includes("res.cloudinary.com"))
    );
  }, []);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleFileUploadComplete = useCallback(
    (
      field: keyof FilePaths,
      result: FileUploadResult | CloudinaryUploadResult
    ) => {
      console.log("=== File upload callback triggered ===", {
        field,
        currentStep,
        success: result.success,
      });

      if (result.success) {
        const fileUrl =
          "url" in result && result.url ? result.url : result.path;
        if (fileUrl) {
          console.log(`File upload complete for ${field}:`, fileUrl);
          setFilePaths((prev) => ({ ...prev, [field]: fileUrl }));
        }
      } else {
        console.error(`File upload failed for ${field}:`, result);
      }
    },
    [currentStep]
  );

  const handleDownload = useCallback((documentType: string) => {
    // Download dummy PDF for MoU documents
    const dummyPdfUrl = "/files/dummy/dummy.pdf";

    // Create a temporary link to download the file
    const link = document.createElement("a");
    link.href = dummyPdfUrl;
    link.download = `${documentType.replace(/\s+/g, "_")}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${documentType} berhasil diunduh!`);
  }, []);

  const submitFundingRequest = useCallback(async () => {
    try {
      setIsLoading(true);

      // Use uploaded file paths - only send if they are valid Cloudinary URLs
      const uploadedFiles = {
        ktp: validateCloudinaryUrl(filePaths.scanKTP) ? filePaths.scanKTP : "",
        foto_diri: validateCloudinaryUrl(filePaths.fotoDiri)
          ? filePaths.fotoDiri
          : "",
        foto_lokasi: validateCloudinaryUrl(filePaths.fotoFranchise)
          ? filePaths.fotoFranchise
          : "",
        mou_franchisor: validateCloudinaryUrl(filePaths.mouFranchisor)
          ? filePaths.mouFranchisor
          : "",
        mou_modal: validateCloudinaryUrl(filePaths.mouModal)
          ? filePaths.mouModal
          : "",
      };

      // Validate that required files are uploaded
      if (
        !uploadedFiles.ktp ||
        !uploadedFiles.foto_diri ||
        !uploadedFiles.foto_lokasi
      ) {
        toast.error("Mohon upload semua dokumen yang diperlukan dengan benar");
        return false;
      }

      // Prepare request payload matching the API structure
      const fundingRequestPayload = {
        confirmation_status: "WAITING" as const,
        address: formData.alamatTempat,
        phone_number: formData.noTelepon,
        npwp: formData.npwp,
        franchise_address: formData.alamatFranchise,
        ktp: uploadedFiles.ktp,
        foto_diri: uploadedFiles.foto_diri,
        foto_lokasi: uploadedFiles.foto_lokasi,
        mou_franchisor: uploadedFiles.mou_franchisor || "",
        mou_modal: uploadedFiles.mou_modal || "",
      };

      const payload: PurchaseFranchisePayload = {
        purchase_type: "FUNDED",
        confirmation_status: "WAITING",
        payment_status: "PROCESSED",
        funding_request: fundingRequestPayload,
      };

      console.log("Submitting payload with MoU files:", {
        mou_franchisor: fundingRequestPayload.mou_franchisor,
        mou_modal: fundingRequestPayload.mou_modal,
        fullPayload: payload,
      });

      // Submit to API
      const response = await axios.post(
        `/api/franchises/${franchiseId}/purchase`,
        payload,
        {
          withCredentials: true,
        }
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

      // Enhanced error handling with help button - Use Case 10.1 preparation
      toast.error(`${errorMessage}. Silakan coba lagi atau hubungi bantuan.`, {
        action: {
          label: "Bantuan",
          onClick: () => window.open("/franchisee/profile/help", "_blank"),
        },
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [formData, filePaths, franchiseId, validateCloudinaryUrl]);

  const handleNext = useCallback(() => {
    // Use Case 3.1: Validate agreement before proceeding from Step 2
    if (currentStep === 2) {
      if (!isAgreedToTerms) {
        toast.error(
          "Anda harus menyetujui syarat dan ketentuan untuk melanjutkan"
        );
        return;
      }
    }

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
      // Navigate to franchisee home
      router.push("/franchisee");
      return;
    }

    if (currentStep === 9) {
      // Navigate to franchisee franchise page
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
  }, [currentStep, showConditionalSteps, router, isAgreedToTerms]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmitConfirm = useCallback(async () => {
    setShowSubmitDialog(false);

    // Use Case 5.1: Enhanced form validation with detailed error messages
    const missingFields = [];
    if (!formData.namaLengkap) missingFields.push("Nama Lengkap");
    if (!formData.alamatTempat) missingFields.push("Alamat Tempat Tinggal");
    if (!formData.noTelepon) missingFields.push("No Telepon");
    if (!formData.npwp) missingFields.push("NPWP");
    if (!formData.alamatFranchise)
      missingFields.push("Alamat Lokasi Franchise");

    if (missingFields.length > 0) {
      toast.error(
        `Mohon lengkapi semua kolom yang diperlukan: ${missingFields.join(
          ", "
        )}`,
        {
          action: {
            label: "Bantuan",
            onClick: () => window.open("/franchisee/profile/help", "_blank"),
          },
        }
      );
      return;
    }

    // Validate that we have valid Cloudinary URLs for required files
    const missingFiles = [];
    if (!validateCloudinaryUrl(filePaths.scanKTP))
      missingFiles.push("Scan KTP");
    if (!validateCloudinaryUrl(filePaths.fotoDiri))
      missingFiles.push("Foto Diri");
    if (!validateCloudinaryUrl(filePaths.fotoFranchise))
      missingFiles.push("Foto Lokasi Franchise");

    if (missingFiles.length > 0) {
      toast.error(
        `Mohon upload semua dokumen yang diperlukan: ${missingFiles.join(
          ", "
        )}`,
        {
          action: {
            label: "Bantuan",
            onClick: () => window.open("/franchisee/profile/help", "_blank"),
          },
        }
      );
      return;
    }

    const success = await submitFundingRequest();
    if (success) {
      setCurrentStep(currentStep + 1);
    }
  }, [
    formData,
    filePaths,
    currentStep,
    submitFundingRequest,
    validateCloudinaryUrl,
  ]);

  const handleSendConfirm = useCallback(async () => {
    setShowSendDialog(false);

    console.log("=== MoU Send Debug Info ===");
    console.log("Current file paths:", filePaths);
    console.log("Existing purchase:", existingPurchase);

    // Validate that we have valid Cloudinary URLs for MoU files
    if (
      !validateCloudinaryUrl(filePaths.mouFranchisor) ||
      !validateCloudinaryUrl(filePaths.mouModal)
    ) {
      toast.error(
        "Mohon upload kedua dokumen MoU yang telah ditandatangani dari Cloudinary"
      );
      return;
    }

    // Check if we have an existing purchase for this specific franchise
    if (!existingPurchase?.id) {
      toast.error("Purchase tidak ditemukan");
      return;
    }

    // Ensure we're working with the correct franchise
    if (existingPurchase.franchise_id !== franchiseId) {
      toast.error("Data franchise tidak sesuai");
      return;
    }

    try {
      setIsLoading(true);

      console.log("=== Sending PUT request to new MoU API ===");
      console.log(
        "PUT Endpoint:",
        `/api/franchisee/franchises/${existingPurchase.id}/mou`
      );
      console.log("PUT Payload:", {
        mou_franchisor: filePaths.mouFranchisor.substring(0, 50) + "...",
        mou_modal: filePaths.mouModal.substring(0, 50) + "...",
      });

      // Update MoU files using new specific endpoint
      const response = await axios.put(
        `/api/franchisee/franchises/${existingPurchase.id}/mou`,
        {
          mou_franchisor: filePaths.mouFranchisor,
          mou_modal: filePaths.mouModal,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("=== PUT Response received ===", response.data);

      if (response.data.success) {
        toast.success("Dokumen MoU berhasil dikirim!");
        setCurrentStep(currentStep + 1);
      } else {
        throw new Error(
          response.data.error || "Failed to update MoU documents"
        );
      }
    } catch (error: unknown) {
      console.error("=== MoU submission error ===", error);
      if (axios.isAxiosError(error)) {
        console.error("Request details:", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengirim dokumen MoU";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    filePaths,
    currentStep,
    validateCloudinaryUrl,
    existingPurchase,
    franchiseId,
  ]);

  // Integrated Form Component for Step 3
  const renderStepThreeForm = () => (
    <div className="mt-4 w-full space-y-6">
      <h1 className="text-xl font-semibold text-black mb-6">
        Formulir Pendaftaran
      </h1>

      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <Label
            htmlFor="namaLengkap"
            className="text-sm font-medium text-black"
          >
            Nama Lengkap
          </Label>
          <Input
            id="namaLengkap"
            placeholder="Dwiyanto Putra"
            value={formData.namaLengkap}
            onChange={(e) => handleInputChange("namaLengkap", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-black">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Dwiyanto28@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* Alamat Tempat Tinggal */}
        <div className="space-y-2">
          <Label
            htmlFor="alamatTempat"
            className="text-sm font-medium text-black"
          >
            Alamat Tempat Tinggal
          </Label>
          <Input
            id="alamatTempat"
            placeholder="Jalan Aja Dulu"
            value={formData.alamatTempat}
            onChange={(e) => handleInputChange("alamatTempat", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* No Telepon */}
        <div className="space-y-2">
          <Label htmlFor="noTelepon" className="text-sm font-medium text-black">
            No Telepon
          </Label>
          <Input
            id="noTelepon"
            placeholder="082327184928"
            value={formData.noTelepon}
            onChange={(e) => handleInputChange("noTelepon", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* NPWP */}
        <div className="space-y-2">
          <Label htmlFor="npwp" className="text-sm font-medium text-black">
            NPWP
          </Label>
          <Input
            id="npwp"
            placeholder="XXXXXXXXXX"
            value={formData.npwp}
            onChange={(e) => handleInputChange("npwp", e.target.value)}
            className="bg-gray-100 border-none"
          />
        </div>

        {/* Alamat Lokasi Franchise */}
        <div className="space-y-2">
          <Label
            htmlFor="alamatFranchise"
            className="text-sm font-medium text-black"
          >
            Alamat Lokasi Franchise
          </Label>
          <Input
            id="alamatFranchise"
            placeholder="Jalan Aja Dulu"
            value={formData.alamatFranchise}
            onChange={(e) =>
              handleInputChange("alamatFranchise", e.target.value)
            }
            className="bg-gray-100 border-none"
          />
        </div>

        {/* Scan KTP */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Scan KTP
            {validateCloudinaryUrl(filePaths.scanKTP) && (
              <span className="ml-2 text-green-600 text-xs">
                ✓ File uploaded
              </span>
            )}
          </Label>
          <CloudinaryUploader
            id="scan-ktp"
            title="Upload Scan KTP"
            onUploadComplete={(result) =>
              handleFileUploadComplete("scanKTP", result)
            }
            maxSizeMB={5}
            acceptedTypes={["png", "jpg", "jpeg"]}
            currentUrl={filePaths.scanKTP || ""}
          />
        </div>

        {/* Upload Foto Diri */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Upload Foto Diri
            {validateCloudinaryUrl(filePaths.fotoDiri) && (
              <span className="ml-2 text-green-600 text-xs">
                ✓ File uploaded
              </span>
            )}
          </Label>
          <CloudinaryUploader
            id="foto-diri"
            title="Upload Foto Diri"
            onUploadComplete={(result) =>
              handleFileUploadComplete("fotoDiri", result)
            }
            maxSizeMB={5}
            acceptedTypes={["png", "jpg", "jpeg"]}
            currentUrl={filePaths.fotoDiri || ""}
          />
        </div>

        {/* Upload Foto Lokasi Franchise */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Upload Foto Lokasi Franchise
            {validateCloudinaryUrl(filePaths.fotoFranchise) && (
              <span className="ml-2 text-green-600 text-xs">
                ✓ File uploaded
              </span>
            )}
          </Label>
          <CloudinaryUploader
            id="foto-franchise"
            title="Upload Foto Lokasi Franchise"
            onUploadComplete={(result) =>
              handleFileUploadComplete("fotoFranchise", result)
            }
            maxSizeMB={5}
            acceptedTypes={["png", "jpg", "jpeg"]}
            currentUrl={filePaths.fotoFranchise || ""}
          />
        </div>
      </div>
    </div>
  );

  // Integrated MOU Component for Step 7
  const renderStepSevenForm = () => (
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
            Unduh Dokumen MoU Franchisor
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
            Upload Dokumen MoU Franchisor
            {validateCloudinaryUrl(filePaths.mouFranchisor) && (
              <span className="ml-2 text-green-600 text-xs">
                ✓ File uploaded
              </span>
            )}
          </Label>
          <CloudinaryUploader
            id="mou-franchisor"
            title="Upload Dokumen MoU Franchisor"
            onUploadComplete={(result) =>
              handleFileUploadComplete("mouFranchisor", result)
            }
            maxSizeMB={10}
            acceptedTypes={["pdf", "doc", "docx", "png", "jpg", "jpeg"]}
            currentUrl={filePaths.mouFranchisor || ""}
          />
        </div>

        {/* Upload MoU Modal */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Upload Dokumen MoU Modal
            {validateCloudinaryUrl(filePaths.mouModal) && (
              <span className="ml-2 text-green-600 text-xs">
                ✓ File uploaded
              </span>
            )}
          </Label>
          <CloudinaryUploader
            id="mou-modal"
            title="Upload Dokumen MoU Modal"
            onUploadComplete={(result) =>
              handleFileUploadComplete("mouModal", result)
            }
            maxSizeMB={10}
            acceptedTypes={["pdf", "doc", "docx", "png", "jpg", "jpeg"]}
            currentUrl={filePaths.mouModal || ""}
          />
        </div>
      </div>
    </div>
  );

  const getButtonText = useCallback(() => {
    switch (currentStep) {
      case 3:
        return "Submit";
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
  }, [currentStep]);

  const showButton = useCallback(() => {
    // Hide buttons for steps 4 and 5 (WAITING and INTERVIEW status)
    // Also hide button for step 6 if it's showing document verification (dummy MoU files)
    if (currentStep === 4 || currentStep === 5) {
      return false;
    }

    if (currentStep === 6) {
      // Check if StepSix is showing document verification view
      const hasDummyMouFiles =
        existingPurchase?.funding_request?.mou_franchisor ===
          "mou_franchisor_dummy.pdf" &&
        existingPurchase?.funding_request?.mou_modal === "mou_modal_dummy.pdf";
      return !hasDummyMouFiles; // Hide button if showing document verification
    }

    return true;
  }, [currentStep, existingPurchase]);

  const showBackButton = useCallback(() => {
    return currentStep === 2 || currentStep === 3;
  }, [currentStep]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return (
          <StepTwo
            onAgreementChange={setIsAgreedToTerms}
            isAgreed={isAgreedToTerms}
          />
        );
      case 3:
        return renderStepThreeForm();
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive />;
      case 6:
        return <StepSix />;
      case 7:
        return renderStepSevenForm();
      case 8:
        return (
          <StepEight
            mouFranchisor={
              existingPurchase?.funding_request?.mou_franchisor || ""
            }
            mouModal={existingPurchase?.funding_request?.mou_modal || ""}
          />
        );
      case 9:
        return <StepNine />;
      default:
        return <StepOne />;
    }
  };

  // Loading component for checking status with skeleton
  const renderLoadingScreen = () => (
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
        <div className="w-full max-w-md">
          <FormSkeleton />
        </div>
      </section>
    </AppLayout>
  );

  // Show loading screen while checking status
  if (isCheckingStatus) {
    return renderLoadingScreen();
  }

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

        {/* Show existing purchase status info if available */}
        {existingPurchase &&
          (currentStep === 4 ||
            currentStep === 5 ||
            currentStep === 6 ||
            currentStep === 8) && (
            <div className="w-full mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">
                  Status Permohonan Saat Ini:
                </p>
                <div className="space-y-1">
                  <p>• ID Permohonan: {existingPurchase.id}</p>
                  <p>
                    • Status Konfirmasi:{" "}
                    {existingPurchase.funding_request?.confirmation_status ||
                      existingPurchase.confirmation_status}
                  </p>
                  <p>• Status Pembayaran: {existingPurchase.payment_status}</p>
                  <p>• Tipe: {existingPurchase.purchase_type}</p>
                  {existingPurchase.funding_request?.id && (
                    <p>
                      • ID Funding Request:{" "}
                      {existingPurchase.funding_request.id}
                    </p>
                  )}
                  {existingPurchase.paid_at && (
                    <p>
                      • Tanggal Bayar:{" "}
                      {new Date(existingPurchase.paid_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  )}
                  {/* Show MoU status for Step 8 */}
                  {currentStep === 8 && (
                    <>
                      <p>
                        • Status MoU Franchisor:{" "}
                        {existingPurchase.funding_request?.mou_franchisor &&
                        existingPurchase.funding_request.mou_franchisor !==
                          "" ? (
                          <span className="text-green-600">✓ Tersedia</span>
                        ) : (
                          <span className="text-red-500">✗ Belum tersedia</span>
                        )}
                      </p>
                      <p>
                        • Status MoU Modal:{" "}
                        {existingPurchase.funding_request?.mou_modal &&
                        existingPurchase.funding_request.mou_modal !== "" ? (
                          <span className="text-green-600">✓ Tersedia</span>
                        ) : (
                          <span className="text-red-500">✗ Belum tersedia</span>
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
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
          {showButton() && (
            <Button
              className={`${
                showBackButton() ? "flex-1" : "w-full"
              } bg-[#EF5A5A] hover:bg-[#e44d4d]`}
              onClick={handleNext}
              disabled={isLoading}
            >
              {getButtonText()}
            </Button>
          )}
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
