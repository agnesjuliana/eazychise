import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole([
    Role.FRANCHISOR,
    Role.FRANCHISEE,
    Role.ADMIN,
  ]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  const { id: purchaseId } = params;

  try {
    const franchise = await prisma.franchise_purchases.findUnique({
      where: { id: purchaseId },
      include: {
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
        },
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
    });

    if (!franchise) {
      return NextResponse.json(
        formatError({ message: "Franchise not found" }),
        { status: 404 }
      );
    }

    if (franchise.user_id !== auth.user.id) {
      return NextResponse.json(
        formatError({ message: "Unauthorized access to this franchise" }),
        { status: 403 }
      );
    }

    return NextResponse.json(
      formatResponse({
        message: "Success get franchise detail",
        data: franchise,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /franchises/:id error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to fetch franchise detail" }),
      { status: 500 }
    );
  }
}
