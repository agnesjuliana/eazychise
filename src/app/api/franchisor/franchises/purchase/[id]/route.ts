import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";
import { ConfirmationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRole([Role.FRANCHISOR]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  const { id } = await context.params;

  try {
    const purchase = await prisma.franchise_purchases.findUnique({
      where: { id },
      include: {
        franchise: {
          select: {
            id: true,
            franchisor_id: true,
            name: true,
            price: true,
            image: true,
            location: true,
            status: true,
            equipment: true,
            materials: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_image: true,
            role: true,
          },
        },
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
      },
    });

    if (!purchase) {
      return NextResponse.json(formatError({ message: "Purchase not found" }), {
        status: 404,
      });
    }

    if (purchase.franchise.franchisor_id !== auth.user.id) {
      return NextResponse.json(
        formatError({ message: "Unauthorized access to purchase" }),
        { status: 403 }
      );
    }

    return NextResponse.json(
      formatResponse({
        message: "Success get purchase",
        data: purchase,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /franchisor/franchises/purchase/:id error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to fetch purchase" }),
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole(Role.FRANCHISOR);

    if ("error" in auth) {
      return NextResponse.json(formatError({ message: auth.error }), {
        status: auth.status,
      });
    }

    const { id } = await params;
    const franchise_purchases = await prisma.franchise_purchases.findUnique({
      where: { id },
      include: {
        franchise: {
          select: {
            franchisor_id: true,
            name: true,
          },
        },
      },
    });

    if (!franchise_purchases) {
      return NextResponse.json(
        formatError({ message: "Purchase Request not found" }),
        {
          status: 404,
        }
      );
    }

    if (franchise_purchases.franchise.franchisor_id !== auth.user.id) {
      return NextResponse.json(
        formatError({ message: "Unauthorized access to purchase request" }),
        { status: 403 }
      );
    }

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        formatError({ message: "Status field is missing" }),
        {
          status: 400,
        }
      );
    }

    if (
      !Object.values(ConfirmationStatus).includes(status as ConfirmationStatus)
    ) {
      return NextResponse.json(formatError({ message: "Invalid Status" }), {
        status: 400,
      });
    }

    const { updated } = await prisma.$transaction(async (tx) => {
      const updated = await prisma.franchise_purchases.update({
        where: { id: franchise_purchases.id },
        data: {
          confirmation_status: status,
        },
        include: {
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
        },
      });

      await tx.user_notifications.create({
        data: {
          user_id: updated.user.id,
          title: "Status Konfirmasi Pembelian Diperbarui",
          message: `Status konfirmasi pembelian untuk franchise ${franchise_purchases.franchise.name} telah diperbarui menjadi ${status}.`,
          type: "purchase",
          is_read: false,
          sent_at: new Date(),
        },
      });

      return { updated };
    });

    return NextResponse.json(
      formatResponse({
        data: updated,
        message: "Successfully updated purchase status",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error updating purchase.", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
