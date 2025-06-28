import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";

const prisma = new PrismaClient();

export async function GET() {
  const auth = await requireRole([Role.FRANCHISOR]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  try {
    const franchise = await prisma.franchise_listings.findFirst({
      where: {
        franchisor_id: auth.user.id,
      },
      include: {
        listing_documents: {
          select: {
            id: true,
            type: true,
            name: true,
            path: true,
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

    if (!franchise) {
      return NextResponse.json(
        formatError({ message: "Franchise not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(
      formatResponse({
        message: "Success get franchise",
        data: franchise,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /franchisor/franchises error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to fetch franchises" }),
      { status: 500 }
    );
  }
}
