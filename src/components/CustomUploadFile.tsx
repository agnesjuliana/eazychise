import { ChangeEvent, useState } from "react";
import { FileUp, Upload, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadFileToServer, FileUploadResult } from "@/utils/fileUtils";

interface CustomUploadFileProps {
  id: string;
  title: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fileName: string | null;
  onUploadComplete?: (result: FileUploadResult) => void;
  maxSizeMB?: number; // Default 10MB
  acceptedTypes?: string[]; // Default ["pdf", "docx", "png", "jpg", "jpeg"]
}

const CustomUploadFile = ({
  id,
  title,
  onFileChange,
  fileName,
  onUploadComplete,
  maxSizeMB = 10,
  acceptedTypes = ["pdf", "png", "jpg", "jpeg"],
}: CustomUploadFileProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<FileUploadResult | null>(
    null
  );
  const [validationError, setValidationError] = useState<string>("");

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

  // Enhanced file change handler with validation
  const handleFileChangeWithValidation = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setValidationError("");
    setIsUploaded(false);
    setUploadResult(null);

    if (file) {
      // Validate file size
      if (!validateFileSize(file)) {
        setValidationError(
          `File terlalu besar. Maksimal ${maxSizeMB}MB. File Anda: ${formatFileSize(
            file.size
          )}`
        );
        // Clear the input
        event.target.value = "";
        return;
      }

      // Validate file type
      if (!validateFileType(file)) {
        setValidationError(
          `Tipe file tidak didukung. Format yang diterima: ${acceptedTypes.join(
            ", "
          )}`
        );
        // Clear the input
        event.target.value = "";
        return;
      }

      // If validation passes, call the original handler
      onFileChange(event);
    }
  };

  const handleUpload = async () => {
    const fileInput = document.getElementById(id) as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) return;

    setIsUploading(true);
    setIsUploaded(false);

    try {
      const result = await uploadFileToServer(file);

      setUploadResult(result);

      if (result.success) {
        setIsUploaded(true);
        onUploadComplete?.(result);
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      alert(
        "Upload failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="bg-[#EF5A5A] text-white text-center p-2 rounded-t-lg font-semibold mb-1">
        {title}
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-b-lg p-6 text-center">
        <label
          htmlFor={id}
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <FileUp className="w-8 h-8 mb-1" />
          {fileName ? (
            <span className="text-sm font-semibold text-gray-800">
              {fileName}
            </span>
          ) : (
            <div>
              <span className="text-[#EF5A5A] font-semibold">pilih</span>{" "}
              <span className="text-black font-semibold">
                file untuk diupload
              </span>
            </div>
          )}
          <p className="text-sm text-[#6E7E9D]">
            mendukung format {acceptedTypes.join(", ")} (maks. {maxSizeMB}MB)
          </p>
        </label>
        <Input
          id={id}
          type="file"
          className="hidden"
          onChange={handleFileChangeWithValidation}
          accept={acceptedTypes.map((type) => `.${type}`).join(",")}
        />

        {/* Validation Error */}
        {validationError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
            {validationError}
          </div>
        )}

        {/* Loading Spinner */}
        {isUploading && (
          <div className="mt-4 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#EF5A5A]" />
            <p className="text-xs text-gray-600 mt-2">Uploading...</p>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-4">
          <Button
            onClick={handleUpload}
            disabled={
              !fileName || isUploading || isUploaded || !!validationError
            }
            className={`
              ${
                isUploaded
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-[#EF5A5A] hover:bg-[#d94a4a]"
              } 
              text-white text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Uploading...
              </>
            ) : isUploaded ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Uploaded
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>

        {/* Upload Result */}
        {uploadResult && uploadResult.success && (
          <div className="mt-2">
            <p className="text-xs text-green-600 break-all">
              Saved to: {uploadResult.path}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomUploadFile;
