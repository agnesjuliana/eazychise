"use client";

import { ChangeEvent, useState } from "react";
import { FileUp, Check, Loader2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export interface CloudinaryUploadResult {
  success: boolean;
  path?: string;
  url?: string;
  secure_url?: string;
  public_id?: string;
  originalName?: string;
  size?: number;
  type?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  error?: string;
}

interface CloudinaryUploaderProps {
  id: string;
  title: string;
  onUploadComplete?: (result: CloudinaryUploadResult) => void;
  maxSizeMB?: number; // Default 10MB
  acceptedTypes?: string[]; // Default ["pdf", "docx", "png", "jpg", "jpeg"]
  className?: string;
  currentUrl?: string; // For displaying existing uploaded files
}

const CloudinaryUploader = ({
  id,
  title,
  onUploadComplete,
  maxSizeMB = 10,
  acceptedTypes = ["pdf", "png", "jpg", "jpeg"],
  className = "",
  currentUrl,
}: CloudinaryUploaderProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(!!currentUrl);
  const [uploadResult, setUploadResult] =
    useState<CloudinaryUploadResult | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl || "");

  // File validation functions
  const validateFileSize = (file: File): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  const validateFileType = (file: File): boolean => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    return extension ? acceptedTypes.includes(extension) : false;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  // File change handler with validation
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValidationError("");
    setIsUploaded(false);
    setUploadResult(null);
    setSelectedFileName("");
    setSelectedFile(null);
    setPreviewUrl("");

    if (file) {
      setSelectedFileName(file.name);

      // Validate file size
      if (!validateFileSize(file)) {
        setValidationError(
          `File terlalu besar. Maksimal ${maxSizeMB}MB. File Anda: ${formatFileSize(
            file.size
          )}`
        );
        event.target.value = "";
        setSelectedFileName("");
        return;
      }

      // Validate file type
      if (!validateFileType(file)) {
        setValidationError(
          `Tipe file tidak didukung. Format yang diterima: ${acceptedTypes.join(
            ", "
          )}`
        );
        event.target.value = "";
        setSelectedFileName("");
        return;
      }

      // If validation passes, store the file and create preview for images
      setSelectedFile(file);

      if (isImageFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Upload handler
  const handleUpload = async () => {
    if (!selectedFile) {
      setValidationError("Tidak ada file yang dipilih");
      return;
    }

    setIsUploading(true);
    setValidationError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      if (result.success) {
        setUploadResult(result);
        setIsUploaded(true);
        setPreviewUrl(result.url || result.path);
        onUploadComplete?.(result);
        console.log("Upload successful:", result);
      } else {
        setValidationError(`Upload gagal: ${result.error}`);
      }
    } catch (error) {
      setValidationError(
        "Upload gagal: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Clear/reset handler
  const handleClear = () => {
    setSelectedFile(null);
    setSelectedFileName("");
    setIsUploaded(false);
    setUploadResult(null);
    setValidationError("");
    setPreviewUrl(currentUrl || "");

    // Clear file input
    const fileInput = document.getElementById(id) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className={className}>
      <div className="bg-primary text-primary-foreground text-center p-2 rounded-t-lg font-semibold mb-1 font-poppins">
        {title}
      </div>
      <div className="border-2 border-dashed border-border rounded-b-lg p-6 text-center">
        {/* Preview Area */}
        {(previewUrl || (isUploaded && uploadResult)) && (
          <div className="mb-4 relative">
            {previewUrl && previewUrl.includes("image") && (
              <div className="relative inline-block">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                  height={150}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
                {!isUploaded && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            {(uploadResult || currentUrl) && !previewUrl.includes("image") && (
              <div className="text-sm text-success font-medium">
                📄{" "}
                {uploadResult?.originalName ||
                  selectedFileName ||
                  "File uploaded"}
              </div>
            )}
          </div>
        )}

        {/* Upload Area */}
        {!isUploaded && (
          <label
            htmlFor={id}
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <FileUp className="w-8 h-8 mb-1" />
            {selectedFileName ? (
              <span className="text-sm font-semibold text-foreground">
                {selectedFileName}
              </span>
            ) : (
              <div>
                <span className="text-primary font-semibold">pilih</span>{" "}
                <span className="text-black font-semibold">
                  File untuk diupload
                </span>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              mendukung format {acceptedTypes.join(", ")} (maks. {maxSizeMB}MB)
            </p>
          </label>
        )}

        <Input
          id={id}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedTypes.map((type) => `.${type}`).join(",")}
          disabled={isUploaded}
        />

        {/* Upload Button */}
        {selectedFile && !isUploaded && !isUploading && (
          <div className="mt-4 flex gap-2 justify-center">
            <button
              type="button"
              onClick={handleUpload}
              className="bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 font-poppins"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-secondary text-secondary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
          </div>
        )}

        {/* Change File Button for uploaded files */}
        {isUploaded && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleClear}
              className="bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Ubah File
            </button>
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive text-xs">
            {validationError}
          </div>
        )}

        {/* Loading Spinner */}
        {isUploading && (
          <div className="mt-4 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-2">
              Mengupload ke cloud...
            </p>
          </div>
        )}

        {/* Upload Success Message */}
        {isUploaded && !isUploading && (
          <div className="mt-4 flex flex-col items-center">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-success mt-2 font-medium">
              File berhasil diupload ke cloud!
            </p>
            {uploadResult?.url && (
              <p className="text-xs text-muted-foreground mt-1 break-all max-w-full">
                URL: {uploadResult.url}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudinaryUploader;
