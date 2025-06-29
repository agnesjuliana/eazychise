import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (max 15MB for videos, 10MB for others)
    const maxSize = file.type.startsWith("video/")
      ? 15 * 1024 * 1024
      : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith("video/") ? 15 : 10;
      return NextResponse.json(
        { success: false, error: `File size exceeds ${maxSizeMB}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "video/mp4",
      "video/avi",
      "video/quicktime", // .mov files
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "File type not supported" },
        { status: 400 }
      );
    }

    // Get file extension
    const getFileExtension = (fileName: string): string => {
      return fileName.split(".").pop()?.toLowerCase() || "";
    };

    // Check if file is an image
    const isImageFile = (fileType: string): boolean => {
      return fileType.startsWith("image/");
    };

    // Generate unique filename with format: [namafileoriginal_date_hashkecil] (max 70 characters)
    const generateUniqueFileName = (originalName: string): string => {
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

    // Determine storage path based on file type
    const getStoragePath = (fileType: string): string => {
      if (isImageFile(fileType)) {
        return "image";
      } else {
        // For PDF and other documents, use /file folder
        return "file";
      }
    };

    // Generate filename and storage path
    const uniqueFileName = generateUniqueFileName(file.name);
    const storageSubPath = getStoragePath(file.type);
    const storagePath = path.join(
      process.cwd(),
      "public",
      "storage",
      storageSubPath
    );

    // Create storage directory if it doesn't exist
    try {
      await mkdir(storagePath, { recursive: true });
    } catch {
      console.log("Directory already exists or created successfully");
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to storage
    const filePath = path.join(storagePath, uniqueFileName);
    await writeFile(filePath, buffer);

    // Return success response with file path
    const relativePath = `/storage/${storageSubPath}/${uniqueFileName}`;

    console.log(`File uploaded successfully:`, {
      originalName: file.name,
      newFileName: uniqueFileName,
      path: relativePath,
      size: file.size,
      type: file.type,
    });

    return NextResponse.json({
      success: true,
      path: relativePath,
      fileName: uniqueFileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
