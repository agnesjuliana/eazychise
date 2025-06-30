import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await req.json();
    const { id: franchiseId } = await params;

    if (!status || !["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update franchise status
    const updatedFranchise = await prisma.franchise_listings.update({
      where: { id: franchiseId },
      data: { status: status },
      include: {
        franchisor: true,
      },
    });

    // Also update the franchisor user status if franchise is accepted
    if (status === "ACCEPTED") {
      await prisma.users.update({
        where: { id: updatedFranchise.franchisor_id },
        data: { status: "ACCEPTED" },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedFranchise,
    });
  } catch (error) {
    console.error("Error updating franchise status:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
