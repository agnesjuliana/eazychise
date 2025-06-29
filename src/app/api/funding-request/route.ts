import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/auth-api";
import { formatResponse, formatError } from "@/utils/response";
import { Role } from "@/type/user";
import type { ConfirmationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const auth = await requireRole(Role.ADMIN);

    if ("error" in auth) {
      return NextResponse.json(formatError({ message: auth.error }), {
        status: auth.status,
      });
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortBy = searchParams.get("sort_by") || "id";
    const sort =
      (searchParams.get("sort") || "desc").toLowerCase() === "asc"
        ? "asc"
        : "desc";
    const status = (searchParams.get("status") || "all").toUpperCase();

    const where: { confirmation_status?: ConfirmationStatus } = {};
    if (status !== "ALL") {
      where.confirmation_status = status as ConfirmationStatus;
    }

    const fundingRequests = await prisma.funding_request.findMany({
      where,
      include: {
        purchase: {
          include: {
            user: {
              select: {
                id: true,
                status: true,
                name: true,
                email: true,
                profile_image: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { [sortBy]: sort },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.funding_request.count({ where });

    const meta = {
      per_page: limit,
      page,
      total_data: total,
      total_page: Math.ceil(total / limit),
      sort,
      sort_by: sortBy,
      filter_by: status,
    };

    const response = fundingRequests.map((request) => ({
      id: request.id,
      purchaseId: request.purchase.id,
      confirmationStatus: request.confirmation_status,
      user: {
        id: request.purchase.user.id,
        status: request.purchase.user.status,
        name: request.purchase.user.name,
        email: request.purchase.user.email,
        profileImage: request.purchase.user.profile_image,
        role: request.purchase.user.role,
      },
    }));

    return NextResponse.json(
      formatResponse({
        message: "Successfully get all funding requests",
        data: response,
        meta,
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error fetching funding requests.", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
