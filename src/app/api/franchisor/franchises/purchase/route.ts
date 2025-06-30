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
    const franchise = await prisma.franchise_listings.findMany({
      where: {
        franchisor_id: auth.user.id,
      },
      include: {
        purchases: {
          select: {
            id: true,
            purchase_type: true,
            confirmation_status: true,
            payment_status: true,
            paid_at: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profile_image: true,
                role: true,
              },
            },
            funding_request: {
              select: {
                id: true,
                confirmation_status: true,
                address: true,
                phone_number: true,
                npwp: true,
                franchise_address: true,
                ktp: true,
                foto_diri: true,
                foto_lokasi: true,
                mou_franchisor: true,
                mou_modal: true,
              },
            },
          },
        },
      },
    });

    const purchase = [];
    for (const item of franchise) {
      purchase.push(...item.purchases);
    }

    // Return empty array if no purchases found instead of 404
    return NextResponse.json(
      formatResponse({
        message: purchase.length > 0 ? "Success get purchases" : "No purchases found",
        data: purchase,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /franchisor/franchises/purchase error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to fetch franchises" }),
      { status: 500 }
    );
  }
}
