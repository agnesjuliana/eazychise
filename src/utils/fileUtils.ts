export interface FileUploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

export interface SavedFileInfo {
  key: string;
  fileName: string;
  path: string;
  savedAt: string;
}

export interface UploadedFileData {
  originalName: string;
  fileName: string;
  path: string;
  type: string;
  size: number;
  uploadDate: string;
}

/**
 * Encode file to base64 string
 */
export const encodeFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Decode base64 string to file
 */
export const decodeBase64ToFile = (
  base64: string,
  fileName: string,
  mimeType: string
): File => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], fileName, { type: mimeType });
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop()?.toLowerCase() || "";
};

/**
 * Check if file is an image
 */
export const isImageFile = (file: File): boolean => {
  const imageTypes = ["png", "jpg", "jpeg"];
  const extension = getFileExtension(file.name);
  return imageTypes.includes(extension);
};

/**
 * Check if file is a PDF
 */
export const isPdfFile = (file: File): boolean => {
  const extension = getFileExtension(file.name);
  return extension === "pdf";
};

/**
 * Check if file is a document (PDF or DOCX)
 */
export const isDocumentFile = (file: File): boolean => {
  const documentTypes = ["pdf", "docx"];
  const extension = getFileExtension(file.name);
  return documentTypes.includes(extension);
};

/**
 * Generate unique filename with format: [namafileoriginal_date_hashkecil] (max 70 characters)
 */
export const generateUniqueFileName = (originalName: string): string => {
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(`.${extension}`, "");

  // Format date as YYYYMMDD
  const now = new Date();
  const date =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0");

  // Generate small hash (6 characters)
  const hashkecil = Math.random().toString(36).substring(2, 8);

  // Calculate max length for original name part
  // Total format: name_date_hash.extension
  // date = 8 chars, hash = 6 chars, underscores = 2 chars, extension = variable
  const fixedLength = 8 + 6 + 2 + 1 + extension.length; // +1 for dot before extension
  const maxNameLength = 70 - fixedLength;

  // Truncate original name if necessary
  const truncatedName =
    nameWithoutExt.length > maxNameLength
      ? nameWithoutExt.substring(0, maxNameLength)
      : nameWithoutExt;

  return `${truncatedName}_${date}_${hashkecil}.${extension}`;
};

/**
 * Determine storage path based on file type (relative to public folder)
 */
export const getStoragePath = (file: File): string => {
  if (isImageFile(file)) {
    return "/storage/image";
  } else {
    // For PDF and other documents, use /file folder
    return "/storage/file";
  }
};

/**
 * Validate file size (default max 10MB)
 */
export const validateFileSize = (
  file: File,
  maxSizeMB: number = 10
): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(extension);
};

/**
 * Create storage directories if they don't exist
 */
export const createStorageDirectories = () => {
  const directories = ["/public/storage/image", "/public/storage/file"];

  // Note: In a real browser environment, you cannot create actual directories
  // This would need to be handled by your backend API
  console.log("Storage directories to create:", directories);
};

/**
 * Save file to localStorage (simulasi penyimpanan file)
 */
export const saveFileToStorage = async (
  file: File,
  storagePath: string,
  fileName: string
): Promise<boolean> => {
  try {
    // Convert file to base64 untuk disimpan di localStorage
    const base64Data = await encodeFileToBase64(file);
    const fileData = {
      fileName,
      originalName: file.name,
      type: file.type,
      size: file.size,
      base64: base64Data,
      storagePath,
      savedAt: new Date().toISOString(),
    };

    // Simpan file di localStorage dengan key unik
    const storageKey = `file_${fileName}`;
    localStorage.setItem(storageKey, JSON.stringify(fileData));

    // Maintain daftar file yang tersimpan
    const savedFiles = JSON.parse(localStorage.getItem("savedFiles") || "[]");
    savedFiles.push({
      key: storageKey,
      fileName,
      path: `${storagePath}/${fileName}`,
      savedAt: fileData.savedAt,
    });
    localStorage.setItem("savedFiles", JSON.stringify(savedFiles));

    console.log(`File tersimpan di localStorage: ${storagePath}/${fileName}`);
    return true;
  } catch (error) {
    console.error("Error saving file to storage:", error);
    return false;
  }
};

/**
 * Upload file to server using the /api/upload endpoint
 */
export const uploadFileToServer = async (
  file: File
): Promise<FileUploadResult> => {
  try {
    // Create FormData to send file
    const formData = new FormData();
    formData.append("file", file);

    // Send file to API endpoint
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Upload failed" };
    }

    if (result.success) {
      // Save file path to sessionStorage for easy access
      const existingPaths = JSON.parse(
        sessionStorage.getItem("uploadedFiles") || "[]"
      );
      const fileData = {
        originalName: result.originalName,
        fileName: result.fileName,
        path: result.path,
        type: result.type,
        size: result.size,
        uploadDate: new Date().toISOString(),
      };
      existingPaths.push(fileData);
      sessionStorage.setItem("uploadedFiles", JSON.stringify(existingPaths));

      // Also save individual file path for easy access
      sessionStorage.setItem(`uploaded_${result.originalName}`, result.path);

      console.log(`File uploaded successfully:`, {
        originalName: result.originalName,
        newFileName: result.fileName,
        path: result.path,
      });

      return {
        success: true,
        path: result.path,
      };
    }

    return { success: false, error: result.error || "Upload failed" };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

/**
 * Get all uploaded files from sessionStorage
 */
export const getUploadedFiles = (): UploadedFileData[] => {
  try {
    return JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");
  } catch (error) {
    console.error("Error reading uploaded files from sessionStorage:", error);
    return [];
  }
};

/**
 * Get specific uploaded file path by original filename
 */
export const getUploadedFilePath = (
  originalFileName: string
): string | null => {
  try {
    return sessionStorage.getItem(`uploaded_${originalFileName}`);
  } catch (error) {
    console.error("Error reading file path from sessionStorage:", error);
    return null;
  }
};

/**
 * Clear all uploaded files from sessionStorage
 */
export const clearUploadedFiles = () => {
  try {
    const uploadedFiles = getUploadedFiles();
    // Remove individual file entries
    uploadedFiles.forEach((file: UploadedFileData) => {
      sessionStorage.removeItem(`uploaded_${file.originalName}`);
    });
    // Remove the main array
    sessionStorage.removeItem("uploadedFiles");
  } catch (error) {
    console.error("Error clearing uploaded files from sessionStorage:", error);
  }
};

/**
 * Remove specific uploaded file from sessionStorage
 */
export const removeUploadedFile = (originalFileName: string) => {
  try {
    const uploadedFiles = getUploadedFiles();
    const filteredFiles = uploadedFiles.filter(
      (file: UploadedFileData) => file.originalName !== originalFileName
    );
    sessionStorage.setItem("uploadedFiles", JSON.stringify(filteredFiles));
    sessionStorage.removeItem(`uploaded_${originalFileName}`);
  } catch (error) {
    console.error("Error removing uploaded file from sessionStorage:", error);
  }
};

/**
 * Get saved files from localStorage
 */
export const getSavedFiles = (): SavedFileInfo[] => {
  try {
    return JSON.parse(localStorage.getItem("savedFiles") || "[]");
  } catch (error) {
    console.error("Error reading saved files from localStorage:", error);
    return [];
  }
};

/**
 * Get file content from localStorage
 */
export const getFileFromStorage = (fileName: string) => {
  try {
    const storageKey = `file_${fileName}`;
    const fileDataString = localStorage.getItem(storageKey);
    if (fileDataString) {
      return JSON.parse(fileDataString);
    }
    return null;
  } catch (error) {
    console.error("Error reading file from localStorage:", error);
    return null;
  }
};

/**
 * Clear all saved files from localStorage
 */
export const clearSavedFiles = () => {
  try {
    const savedFiles = getSavedFiles();
    // Remove individual file entries
    savedFiles.forEach((file: SavedFileInfo) => {
      localStorage.removeItem(file.key);
    });
    // Remove the main array
    localStorage.removeItem("savedFiles");
  } catch (error) {
    console.error("Error clearing saved files from localStorage:", error);
  }
};
