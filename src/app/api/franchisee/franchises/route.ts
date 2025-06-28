import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";

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
      select: {
        purchase_type: true,
        confirmation_status: true,
        payment_status: true,
        paid_at: true,
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
        franchise: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            status: true,
            location: true,
            ownership_document: true,
            financial_statement: true,
            proposal: true,
            sales_location: true,
            equipment: true,
            materials: true,
            franchisor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            listing_documents: {
              select: {
                id: true,
                type: true,
                name: true,
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
        },
      },
      skip: skip,
      take: limit,
    });

    if (!purchases || purchases.length === 0) {
      return NextResponse.json(
        formatError({ message: "Franchises not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(
      formatResponse({
        message: "Success get franchises",
        data: purchases,
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
