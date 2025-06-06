import { PrismaClient, Role, Status } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Mendapatkan URL dan parameter dari request
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const role = searchParams.get("role");

    const whereCondition: {
      status?: Status;
      role?: Role;
    } = {}; // Menambahkan filter berdasarkan parameter yang diberikan
    if (status) {
      // Validasi nilai status
      if (
        status === "pending" ||
        status === "active" ||
        status === "rejected" ||
        status === "revisi"
      ) {
        whereCondition.status = status as Status;
      }
    }

    if (role) {
      // Validasi nilai role
      if (role === "franchisee" || role === "franchisor" || role === "admin") {
        whereCondition.role = role as Role;
      }
    }
    // Mengambil data users dengan filter
    const users = await prisma.user.findMany({
      where: whereCondition,
    });

    const res = NextResponse.json({
      success: true,
      filters: {
        status: status || null,
        role: role || null,
      },
      count: users.length,
      data: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })),
    });
    return res;
  } catch (err: unknown) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
