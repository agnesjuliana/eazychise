import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Email tidak ditemukan" },
        { status: 404 }
      );
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });

    res.cookies.set(
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
        maxAge: 60 * 60 * 24, // kurleb 1 hari lah ya buat session nya ya gak seh
      }
    );

    return res;
  } catch (err: unknown) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

// Endpoint GET untuk mengecek status login: digunakan untuk verifikasi status login pengguna
export async function GET() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session");

    if (!sessionCookie) {
      return NextResponse.json(
        {
          isLoggedIn: false,
          error: "No active session found",
        },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);

    const user = await prisma.users.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        role: true,
        status: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          isLoggedIn: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      isLoggedIn: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        status: user.status,
        email: user.email,
      },
      statusChanged: session.status !== user.status,
    });

    // Update session cookie jika status berubah
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
          maxAge: 60 * 60 * 24,
        }
      );
    }

    return response;
  } catch (error: unknown) {
    console.error("Error fetching user session:", error);
    return NextResponse.json(
      { isLoggedIn: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
