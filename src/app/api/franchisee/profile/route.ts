import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session");

    if (!sessionCookie) {
      return NextResponse.json(
        {
          success: false,
          error: "Session tidak ditemukan",
        },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);

    if (session.role !== "FRANCHISEE") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Akses ditolak. Hanya franchisee yang dapat mengakses endpoint ini",
        },
        { status: 403 }
      );
    }

    // Get user basic info
    const user = await prisma.users.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Get franchisee profile from funding_request
    const franchiseeProfile = await prisma.funding_request.findFirst({
      where: {
        purchase: {
          user_id: session.id,
        },
      },
      select: {
        id: true,
        address: true,
        phone_number: true,
        npwp: true,
        franchise_address: true,
        ktp: true,
        foto_diri: true,
        foto_lokasi: true,
        mou_franchisor: true,
        mou_modal: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        user,
        profile: franchiseeProfile,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching franchisee profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session");

    if (!sessionCookie) {
      return NextResponse.json(
        {
          success: false,
          error: "Session tidak ditemukan",
        },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);

    if (session.role !== "FRANCHISEE") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Akses ditolak. Hanya franchisee yang dapat mengakses endpoint ini",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      address,
      phone_number,
      npwp,
      franchise_address,
      ktp,
      foto_diri,
      foto_lokasi,
      mou_franchisor,
      mou_modal,
    } = body;

    // Validation for required fields
    if (!address || !phone_number) {
      return NextResponse.json(
        {
          success: false,
          error: "Alamat dan nomor telepon wajib diisi",
        },
        { status: 400 }
      );
    }

    // Check if user has any franchise purchases to create/update funding request
    const purchase = await prisma.franchise_purchases.findFirst({
      where: {
        user_id: session.id,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        {
          success: false,
          error: "Belum ada pembelian franchise untuk membuat profil",
        },
        { status: 400 }
      );
    }

    // Check if funding request already exists
    const existingProfile = await prisma.funding_request.findUnique({
      where: {
        purchase_id: purchase.id,
      },
    });

    const updateData: {
      address?: string;
      phone_number?: string;
      npwp?: string;
      franchise_address?: string;
      ktp?: string;
      foto_diri?: string;
      foto_lokasi?: string;
      mou_franchisor?: string;
      mou_modal?: string;
    } = {};
    if (address) updateData.address = address.trim();
    if (phone_number) updateData.phone_number = phone_number.trim();
    if (npwp) updateData.npwp = npwp.trim();
    if (franchise_address)
      updateData.franchise_address = franchise_address.trim();
    if (ktp) updateData.ktp = ktp.trim();
    if (foto_diri) updateData.foto_diri = foto_diri.trim();
    if (foto_lokasi) updateData.foto_lokasi = foto_lokasi.trim();
    if (mou_franchisor) updateData.mou_franchisor = mou_franchisor.trim();
    if (mou_modal) updateData.mou_modal = mou_modal.trim();

    let updatedProfile;

    if (existingProfile) {
      // Update existing profile
      updatedProfile = await prisma.funding_request.update({
        where: { purchase_id: purchase.id },
        data: updateData,
      });
    } else {
      // Create new profile - all required fields must be provided
      if (
        !address ||
        !phone_number ||
        !npwp ||
        !franchise_address ||
        !ktp ||
        !foto_diri ||
        !foto_lokasi ||
        !mou_franchisor ||
        !mou_modal
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Semua field wajib diisi untuk membuat profil baru",
          },
          { status: 400 }
        );
      }

      updatedProfile = await prisma.funding_request.create({
        data: {
          purchase_id: purchase.id,
          address: address.trim(),
          phone_number: phone_number.trim(),
          npwp: npwp.trim(),
          franchise_address: franchise_address.trim(),
          ktp: ktp.trim(),
          foto_diri: foto_diri.trim(),
          foto_lokasi: foto_lokasi.trim(),
          mou_franchisor: mou_franchisor.trim(),
          mou_modal: mou_modal.trim(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profil franchisee berhasil diperbarui",
      data: updatedProfile,
    });
  } catch (error: unknown) {
    console.error("Error updating franchisee profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}
