import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const franchiseId = slug;

    // If slug is a franchiseId, fetch franchise details
    const franchise = await prisma.franchise_listings.findUnique({
      where: { id: franchiseId },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      franchise: franchise,
    });
  } catch (error: unknown) {
    console.error("Error fetching franchise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
