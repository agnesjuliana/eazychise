import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    console.log("Register body:", body);
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
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

    const admins = await prisma.users.findMany({
      where: {
        role: "ADMIN",
      },
    });

    const hashedPassword = await hash(password, 10);

    const { user } = await prisma.$transaction(async (tx) => {
      const user = await prisma.users.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "FRANCHISEE",
          status: "WAITING", // Default status for new users
        },
      });

      await tx.user_notifications.createMany({
        data: admins.map((admin) => ({
          user_id: admin.id,
          title: "New Franchisee Registered",
          message: `${user.name} telah melakukan registrasi sebagai franchisee dan sedang menunggu konfirmasi.`,
          type: "new_user",
          is_read: false,
          sent_at: new Date(),
        })),
      });

      return { user };
    });

    return NextResponse.json({ success: true, id: user.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
