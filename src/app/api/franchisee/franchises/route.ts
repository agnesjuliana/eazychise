import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatError, formatResponse } from "@/utils/response";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(_req: Request) {
  const auth = await requireRole([Role.FRANCHISEE]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  const { searchParams } = new URL(_req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const purchases = await prisma.franchise_purchases.findMany({
      where: {
        user_id: auth.user.id,
      },
      include: {
        franchise: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            status: true,
            location: true,
            franchisor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        funding_request: {
          select: {
            id: true,
            confirmation_status: true,
            mou_franchisor: true,
            mou_modal: true,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        paid_at: "desc",
      },
    });

    const total = await prisma.franchise_purchases.count({
      where: {
        user_id: auth.user.id,
      },
    });

    return NextResponse.json(
      formatResponse({
        message: "Success get owned franchises",
        data: purchases,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /franchisee/franchises error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to fetch franchises" }),
      { status: 500 }
    );
  }
}
