import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";
import { FranchiseUpdatePayload } from "@/type/franchise";

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

  const { id: franchiseId } = params;

  try {
    const franchise = await prisma.franchise_listings.findUnique({
      where: { id: franchiseId },
      include: {
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

// PUT api/franchises/:id
export async function PUT(req: Request, context: { params: { id: string } }) {
  const auth = await requireRole([Role.FRANCHISOR]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), { status: auth.status });
  }

  const { id } = context.params;
  const body: FranchiseUpdatePayload = await req.json();

  try {
    const franchise = await prisma.franchise_listings.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price,
        image: body.image,
        status: body.status,
        location: body.location,
        ownership_document: body.ownership_document,
        financial_statement: body.financial_statement,
        proposal: body.proposal,
        sales_location: body.sales_location,
        equipment: body.equipment,
        materials: body.materials,
      },
    });

    return NextResponse.json(
      formatResponse({
        message: "Franchise updated successfully",
        data: { ...franchise },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE FRANCHISE ERROR:", error);
    return NextResponse.json(
      formatError({ message: "Failed to update franchise" }),
      { status: 500 }
    );
  }
}

