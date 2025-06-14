import { PrismaClient, Roles, Status } from "@prisma/client";
import { NextResponse } from "next/server";
import { formatResponse, formatError } from "@/utils/response";
import { buildMeta } from "@/utils/pagination";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Ambil query params
    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "10");
    const status = searchParams.get("status");
    const role = searchParams.get("role");
    const sort = searchParams.get("sort") || "asc";
    const sort_by = searchParams.get("sort_by") || "name";

    // Validasi dan siapkan where condition
    const whereCondition: {
      status?: Status;
      role?: Roles;
    } = {};

    if (status && ["WAITING", "REJECTED", "ACCEPTED"].includes(status)) {
      whereCondition.status = status as Status;
    }

    if (role && ["FRANCHISEE", "FRANCHISOR", "ADMIN"].includes(role)) {
      whereCondition.role = role as Roles;
    }

    // Hitung total data
    const total_data = await prisma.users.count({ where: whereCondition });

    // Ambil data dengan pagination
    const users = await prisma.users.findMany({
      where: whereCondition,
      skip: (page - 1) * per_page,
      take: per_page,
      orderBy: {
        [sort_by]: sort === "asc" ? "asc" : "desc",
      },
    });

    return NextResponse.json(
      formatResponse({
        message: "Success fetch users",
        data: users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        })),
        meta: buildMeta({
          per_page,
          page,
          total_data,
          sort,
          sort_by,
          filter_by: status || role || "",
        }),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /users error:", err);
    return NextResponse.json(
      formatError({ message: "Failed to fetch users" }),
      { status: 500 }
    );
  }
}
