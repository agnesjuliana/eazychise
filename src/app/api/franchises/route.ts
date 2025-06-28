import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSessionUser, requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";
import { CreateFranchisePayload } from "@/type/franchise";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      formatError({ message: "No franchisor account" }),
      { status: 401 }
    );
  }

  if (user.role !== Role.FRANCHISOR) {
    return NextResponse.json(
      formatError({ message: "Only franchisors can register franchises" }),
      { status: 403 }
    );
  }

  try {
    const data: CreateFranchisePayload = await req.json();

    // Optional: Check if this franchisor already has a franchise
    const existing = await prisma.franchise_listings.findFirst({
      where: { franchisor_id: user.id },
    });

    if (existing) {
      return NextResponse.json(
        formatError({ message: "Franchise already registered" }),
        { status: 400 }
      );
    }

    const newFranchise = await prisma.franchise_listings.create({
      data: {
        franchisor_id: user.id,
        confirmation_status: "WAITING",
        name: data.name,
        price: data.price,
        image: data.image,
        status: data.status,
        location: data.location,
        ownership_document: data.ownership_document,
        financial_statement: data.financial_statement,
        proposal: data.proposal,
        sales_location: data.sales_location,
        equipment: data.equipment,
        materials: data.materials,
      },
    });

    return NextResponse.json(
      formatResponse({
        message: "Franchise successfully registered",
        data: newFranchise,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /franchise/register error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to register franchise" }),
      { status: 500 }
    );
  }
}

export async function GET(_req: Request) {
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

  const { searchParams } = new URL(_req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const franchise = await prisma.franchise_listings.findMany({
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
      skip: skip,
      take: limit,
    });

    const total = await prisma.franchise_listings.count();

    if (!franchise || franchise.length === 0) {
      return NextResponse.json(
        formatError({ message: "Franchises not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(
      formatResponse({
        message: "Success get franchises",
        data: franchise,
        meta: {
          per_page: limit,
          page,
          total_data: total,
          total_page: Math.ceil(total / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /franchises error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to fetch franchises" }),
      { status: 500 }
    );
  }
}
