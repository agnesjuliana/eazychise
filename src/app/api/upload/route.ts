import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, getFileTypeCategory } from "@/lib/cloudinary";

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

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine folder based on file type
    const fileCategory = getFileTypeCategory(file.type);
    const folder = `eazychise/${fileCategory}`;

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, file.name, folder);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || "Upload failed" },
        { status: 500 }
      );
    }

    console.log(`File uploaded successfully to Cloudinary:`, {
      originalName: file.name,
      cloudinaryUrl: uploadResult.url,
      publicId: uploadResult.public_id,
      size: file.size,
      type: file.type,
    });

    return NextResponse.json({
      success: true,
      path: uploadResult.url, // Return Cloudinary URL instead of local path
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      originalName: file.name,
      size: file.size,
      type: file.type,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
