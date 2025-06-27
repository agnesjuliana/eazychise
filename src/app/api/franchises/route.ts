import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSessionUser } from "@/lib/auth-api-backup";
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
