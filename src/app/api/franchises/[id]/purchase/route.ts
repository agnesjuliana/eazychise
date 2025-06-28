import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";
import { type PurchaseFranchisePayload } from "@/type/franchise";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(Role.FRANCHISEE);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  // ✅ Extract params safely to avoid async warning
  const franchiseId = params.id;
  const body: PurchaseFranchisePayload = await req.json();

  try {
    const { franchise_purchases, funding_request } = await prisma.$transaction(
      async (tx) => {
        // Create purchase record
        const franchise_purchases = await tx.franchise_purchases.create({
          data: {
            user_id: auth.user.id,
            franchise_id: franchiseId,
            purchase_type: body.purchase_type,
            confirmation_status: body.confirmation_status,
            payment_status: body.payment_status,
            paid_at: body.paid_at ? new Date(body.paid_at) : undefined,
          },
        });

        let funding_request = null;

        // Create funding request if provided
        if (body.funding_request) {
          funding_request = await tx.funding_request.create({
            data: {
              purchase_id: franchise_purchases.id,
              confirmation_status: body.funding_request.confirmation_status,
              address: body.funding_request.address,
              phone_number: body.funding_request.phone_number,
              npwp: body.funding_request.npwp,
              franchise_address: body.funding_request.franchise_address,
              ktp: body.funding_request.ktp,
              foto_diri: body.funding_request.foto_diri,
              foto_lokasi: body.funding_request.foto_lokasi,
              mou_franchisor: body.funding_request.mou_franchisor,
              mou_modal: body.funding_request.mou_modal,
            },
          });
        }

        return { franchise_purchases, funding_request };
      }
    );

    return NextResponse.json(
      formatResponse({
        message: "Success create franchise purchase",
        data: {
          ...franchise_purchases,
          funding_request: funding_request
            ? {
                id: funding_request.id,
                confirmation_status: funding_request.confirmation_status,
                address: funding_request.address,
                phone_number: funding_request.phone_number,
                npwp: funding_request.npwp,
                franchise_address: funding_request.franchise_address,
                ktp: funding_request.ktp,
                foto_diri: funding_request.foto_diri,
                foto_lokasi: funding_request.foto_lokasi,
                mou_franchisor: funding_request.mou_franchisor,
                mou_modal: funding_request.mou_modal,
              }
            : undefined,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /franchise/:id/purchase error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to create purchase data" }),
      { status: 500 }
    );
  }
}
