import { PrismaClient, Roles, Status } from "@prisma/client";
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
      role?: Roles;
    } = {}; // Menambahkan filter berdasarkan parameter yang diberikan
    if (status) {
      // Validasi nilai status
      if (
        status === "WAITING" ||
        status === "REJECTED" ||
        status === "ACCEPTED"
      ) {
        whereCondition.status = status as Status;
      }
    }

    if (role) {
      // Validasi nilai role
      if (role === "FRANCHISEE" || role === "FRANCHISOR" || role === "ADMIN") {
        whereCondition.role = role as Roles;
      }
    }
    // Mengambil data users dengan filter
    const users = await prisma.users.findMany({
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
      })),
    });
    return res;
  } catch (err: unknown) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
