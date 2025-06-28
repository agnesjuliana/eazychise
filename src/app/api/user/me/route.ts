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

    // Fetch current user data from database
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

    let detail = null;
    if (user.role === "FRANCHISOR") {
      detail = await prisma.franchisor_profiles.findUnique({
        where: {
          user_id: user.id,
        },
      });
    }

    let franchise = null;
    if (user?.role === "FRANCHISOR") {
      franchise = await prisma.franchise_listings.findFirst({
        where: {
          franchisor_id: user.id,
        },
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          status: true,
          location: true,
          ownership_document: true,
          financial_statement: true,
          proposal: true,
          sales_location: true,
          equipment: true,
          materials: true,
          listing_documents: {
            select: {
              id: true,
              type: true,
              name: true,
            },
          },
          listings_highlights: {
            select: {
              id: true,
              title: true,
              content: true,
            },
          },
        },
      });
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        detail:
          user.role === "FRANCHISOR"
            ? {
                id: detail?.id || undefined,
                ktp: detail?.ktp || undefined,
                foto_diri: detail?.foto_diri || undefined,
              }
            : undefined,
        franchise:
          user?.role === "FRANCHISOR"
            ? {
                ...franchise,
              }
            : undefined,
      },
      token: "session_token", // Add token for consistency
    });

    // Update session cookie if status has changed
    if (session.status !== user.status) {
      response.cookies.set(
        "session",
        JSON.stringify({
          id: user.id,
          name: user.name,
          role: user.role,
          status: user.status,
        }),
        {
          path: "/",
          httpOnly: true,
          maxAge: 60 * 60 * 24, // 1 day
        }
      );
    }

    return response;
  } catch (error: unknown) {
    console.error("Error fetching current user:", error);
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
    const body = await request.json();
    const { name, email, ktp, foto_diri } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama dan email wajib diisi",
        },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.users.findFirst({
      where: {
        email: email,
        id: { not: session.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email sudah digunakan oleh pengguna lain",
        },
        { status: 409 }
      );
    }

    // Update user data
    const updatedUser = await prisma.users.update({
      where: { id: session.id },
      data: {
        name: name.trim(),
        email: email.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    let updatedDetail = null;
    // Update franchisor details if role is FRANCHISOR and detail data is provided
    if (session.role === "FRANCHISOR" && (ktp || foto_diri)) {
      const updateData: { ktp?: string; foto_diri?: string } = {};
      if (ktp) updateData.ktp = ktp.trim();
      if (foto_diri) updateData.foto_diri = foto_diri.trim();

      // Check if franchisor profile exists
      const existingProfile = await prisma.franchisor_profiles.findUnique({
        where: { user_id: session.id },
      });

      if (existingProfile) {
        // Update existing profile
        updatedDetail = await prisma.franchisor_profiles.update({
          where: { user_id: session.id },
          data: updateData,
        });
      } else {
        // Create new profile - both fields are required for creation
        if (!ktp || !foto_diri) {
          return NextResponse.json(
            {
              success: false,
              error: "KTP dan foto diri wajib diisi untuk membuat profil baru",
            },
            { status: 400 }
          );
        }
        updatedDetail = await prisma.franchisor_profiles.create({
          data: {
            user: {
              connect: { id: session.id },
            },
            ktp: ktp.trim(),
            foto_diri: foto_diri.trim(),
          },
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Data berhasil diperbarui",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        detail: updatedDetail
          ? {
              id: updatedDetail.id,
              ktp: updatedDetail.ktp,
              foto_diri: updatedDetail.foto_diri,
            }
          : null,
      },
    });

    // Update session cookie with new data
    response.cookies.set(
      "session",
      JSON.stringify({
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role,
        status: updatedUser.status,
      }),
      {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
      }
    );

    return response;
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}
