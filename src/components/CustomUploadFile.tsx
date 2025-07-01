import { ChangeEvent, useState } from "react";
import { FileUp, Check, Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

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

  // File change handler with validation (no auto-upload)
  const handleFileChangeWithValidation = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setValidationError("");
    setIsUploaded(false);
    setUploadResult(null);
    setSelectedFileName("");
    setSelectedFile(null);

    if (file) {
      setSelectedFileName(file.name);

      // Validate file size
      if (!validateFileSize(file)) {
        setValidationError(
          `File terlalu besar. Maksimal ${maxSizeMB}MB. File Anda: ${formatFileSize(
            file.size
          )}`
        );
        // Clear the input
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
        // Clear the input
        event.target.value = "";
        setSelectedFileName("");
        return;
      }

      // If validation passes, store the file and call the original handler
      setSelectedFile(file);
      onFileChange(event);
    }
  };

  // Manual upload handler
  const handleManualUpload = async () => {
    if (!selectedFile) {
      setValidationError("Tidak ada file yang dipilih");
      return;
    }

    setIsUploading(true);
    setValidationError("");

    try {
      const result = await uploadFileToServer(selectedFile);
      setUploadResult(result);

      if (result.success) {
        setIsUploaded(true);
        onUploadComplete?.(result);
        console.log("Manual upload successful:", result);
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

  return (
    <div>
      <div className="bg-primary text-primary-foreground text-center p-2 rounded-t-lg font-semibold mb-1 font-poppins">
        {title}
      </div>
      <div className="border-2 border-dashed border-border rounded-b-lg p-6 text-center">
        <label
          htmlFor={id}
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <FileUp className="w-8 h-8 mb-1" />
          {fileName || selectedFileName ? (
            <span className="text-sm font-semibold text-foreground">
              {isUploaded
                ? "File berhasil diupload"
                : fileName || selectedFileName}
            </span>
          ) : (
            <div>
              <span className="text-primary font-semibold">pilih</span>{" "}
              <span className="text-black font-semibold">
                File untuk diupload
              </span>
            </div>
          )}
          <p className="text-sm text-muted-foreground font-poppins">
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

        {/* Manual Upload Button */}
        {selectedFile && !isUploaded && !isUploading && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleManualUpload}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-poppins"
            >
              <Upload className="w-4 h-4" />
              Upload File
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
              Mengupload file...
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
              File berhasil diupload!
            </p>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && uploadResult.success && (
          <div className="mt-2">
            <p className="text-xs text-success break-all">
              File disimpan dengan nama &quot;
              {(uploadResult.path?.split("/").pop() || fileName || "").replace(
                /\s+/g,
                "-"
              )}
              &quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomUploadFile;
