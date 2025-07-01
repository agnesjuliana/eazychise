import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireRole(["FRANCHISEE"]);

    // Check if auth returned an error
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { id: purchaseId } = params;

    const body = await request.json();
    const { mou_franchisor, mou_modal } = body;

    // Validate required fields
    if (!mou_franchisor || !mou_modal) {
      return NextResponse.json(
        {
          success: false,
          error: "Both MoU documents are required",
        },
        { status: 400 }
      );
    }

    // Find specific purchase by ID and ensure ownership
    const purchase = await prisma.franchise_purchases.findUnique({
      where: {
        id: purchaseId,
        user_id: auth.user.id, // Ensure ownership
      },
      include: {
        funding_request: true,
        franchise: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        {
          success: false,
          error: "Purchase not found or access denied",
        },
        { status: 404 }
      );
    }

    if (!purchase.funding_request) {
      return NextResponse.json(
        {
          success: false,
          error: "Funding request not found for this purchase",
        },
        { status: 404 }
      );
    }

    // Check if funding request is in ACCEPTED status (ready for MoU upload)
    if (purchase.funding_request.confirmation_status !== "ACCEPTED") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Funding request must be in ACCEPTED status to upload MoU documents",
        },
        { status: 400 }
      );
    }

    // Update only MoU documents
    const updatedFundingRequest = await prisma.funding_request.update({
      where: { id: purchase.funding_request.id },
      data: {
        mou_franchisor,
        mou_modal,
      },
    });

    // Also update the main purchase confirmation_status to WAITING
    // since new MoU documents need to be reviewed
    await prisma.franchise_purchases.update({
      where: { id: purchaseId },
      data: {
        confirmation_status: "WAITING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "MoU documents updated successfully",
      data: {
        funding_request_id: updatedFundingRequest.id,
        franchise_id: purchase.franchise_id,
        franchise_name: purchase.franchise?.name,
        mou_franchisor: updatedFundingRequest.mou_franchisor,
        mou_modal: updatedFundingRequest.mou_modal,
      },
    });
  } catch (error) {
    console.error("Error updating MoU documents:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
