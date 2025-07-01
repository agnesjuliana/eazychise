import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";
import { type PurchaseFranchisePayload } from "@/type/franchise";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(Role.FRANCHISEE);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  // ✅ Extract params safely to avoid async warning
  const { id: franchiseId } = await params;
  const body: PurchaseFranchisePayload = await req.json();

  const franchise = await prisma.franchise_listings.findUnique({
    where: { id: franchiseId },
  });

  if (!franchise) {
    return NextResponse.json(formatError({ message: "Franchise not found" }), {
      status: 404,
    });
  }

  const admins = await prisma.users.findMany({
    where: { role: Role.ADMIN },
    select: { id: true },
  });

  try {
    const { franchise_purchases, funding_request } = await prisma.$transaction(
      async (tx) => {
        // Create purchase record
        const franchise_purchases = await tx.franchise_purchases.create({
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user_id: (auth.user as any).id,
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

          await tx.user_notifications.create({
            data: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              user_id: (auth.user as any).id,
              title: "Permintaan Pendanaan Dikirim",
              message: `Permintaan pendanaan untuk franchise ${franchise.name} telah dikirim.`,
              type: "funding_request",
              is_read: false,
              sent_at: new Date(),
            },
          });

          for (const admin of admins) {
            await tx.user_notifications.create({
              data: {
                user_id: admin.id,
                title: "Permintaan Pendanaan Baru",
                message: `${
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (auth.user as any).name
                } telah mengirim permintaan pendanaan untuk franchise ${
                  franchise.name
                }.`,
                type: "funding_request",
                is_read: false,
                sent_at: new Date(),
              },
            });
          }
        }

        await tx.user_notifications.create({
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user_id: (auth.user as any).id,
            title: "Pembelian Franchise Berhasil",
            message: `Anda telah berhasil melakukan pembelian franchise ${franchise.name}.`,
            type: "purchase",
            is_read: false,
            sent_at: new Date(),
          },
        });

        await tx.user_notifications.create({
          data: {
            user_id: franchise.franchisor_id,
            title: "Pembelian Franchise Baru",

            message: `${
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (auth.user as any).name
            } telah melakukan pembelian franchise ${franchise.name}.`,
            type: "purchase",
            is_read: false,
            sent_at: new Date(),
          },
        });

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
