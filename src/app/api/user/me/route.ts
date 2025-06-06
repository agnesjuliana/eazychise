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
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
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

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
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
    const { name, email } = body;

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
    const existingUser = await prisma.user.findFirst({
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
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: name.trim(),
        email: email.trim(),
        updated_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Data berhasil diperbarui",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
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
