import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, action, message } = body;

    // Validasi input
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID pengguna diperlukan" },
        { status: 400 }
      );
    }

    if (!action || !["approve", "reject", "revisi"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Tindakan tidak valid" },
        { status: 400 }
      );
    }

    // Cek apakah user ada
    const user = await prisma.users.findUnique({
      where: { id: id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    let updateData = {};

    // Tentukan action yang akan dilakukan
    switch (action) {
      case "approve":
        updateData = { status: "active" };
        break;
      case "reject":
        updateData = { status: "rejected" };
        break;
      case "revisi":
        if (!message?.trim()) {
          return NextResponse.json(
            { success: false, message: "Pesan revisi diperlukan" },
            { status: 400 }
          );
        }
        // Di sini kita bisa menambahkan logika untuk revisi
        // Misalnya menyimpan pesan revisi dan mengubah status jika diperlukan
        // (Anda mungkin perlu menyesuaikan skema database untuk menyimpan pesan revisi)
        updateData = { status: "revisi" }; // Asumsikan ada status 'revisi' di enum Status
        break;
    }

    // Update user
    await prisma.users.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Akun berhasil ${
        action === "approve"
          ? "disetujui"
          : action === "reject"
          ? "ditolak"
          : "diminta untuk direvisi"
      }`,
    });
  } catch (err: unknown) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { success: false, message: "Gagal memproses permintaan" },
      { status: 500 }
    );
  }
}
