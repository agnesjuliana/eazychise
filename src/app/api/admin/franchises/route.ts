import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const franchises = await prisma.franchise_listings.findMany({
      include: {
        franchisor: {
          include: {
            franchisor_profiles: true,
          },
        },
        listings_highlights: true,
        listing_documents: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: franchises,
    });
  } catch (error) {
    console.error("Error fetching franchises:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
