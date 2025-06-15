import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { Role } from "@/type/user";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const allowedRoles = [Role.FRANCHISOR, Role.FRANCHISEE];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Role hanya boleh FRANCHISOR atau FRANCHISEE" },
        { status: 400 }
      );
    }

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status: "WAITING",
      },
    });

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
        maxAge: 60 * 60 * 24,
      }
    );

    return res;
  } catch (err: unknown) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
