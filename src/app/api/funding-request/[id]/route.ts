import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/auth-api";
import { formatResponse, formatError } from "@/utils/response";
import { Role } from "@/type/user";
import { ConfirmationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole(Role.ADMIN);

    if ("error" in auth) {
      return NextResponse.json(formatError({ message: auth.error }), {
        status: auth.status,
      });
    }

    const { id } = await context.params;

    const funding_request = await prisma.funding_request.findUnique({
      where: { id },
      include: {
        purchase: {
          select: {
            id: true,
            purchase_type: true,
            confirmation_status: true,
            payment_status: true,
            paid_at: true,
            franchise: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                status: true,
                location: true,
                ownership_document: true,
                financial_statement: true,
                proposal: true,
                sales_location: true,
                equipment: true,
                materials: true,
              },
            },
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
          },
        },
      },
    });

    if (!funding_request) {
      return NextResponse.json(
        formatError({ message: "Funding Request not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(
      formatResponse({
        data: funding_request,
        message: "Successfully get funding request",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching funding request.", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole(Role.ADMIN);

    if ("error" in auth) {
      return NextResponse.json(formatError({ message: auth.error }), {
        status: auth.status,
      });
    }

    const { id } = await params;
    const funding_request = await prisma.funding_request.findUnique({
      where: { id },
      include: {
        purchase: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!funding_request) {
      return NextResponse.json(
        formatError({ message: "Funding Request not found" }),
        {
          status: 404,
        }
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
      if (status == "REJECTED") {
        await tx.franchise_purchases.update({
          where: {
            id: funding_request.purchase_id,
          },
          data: {
            confirmation_status: "REJECTED",
          },
        });
      }

      const updated = await tx.funding_request.update({
        where: { id: funding_request.id },
        data: {
          confirmation_status: status,
        },
        include: {
          purchase: {
            select: {
              id: true,
              purchase_type: true,
              confirmation_status: true,
              payment_status: true,
              paid_at: true,
              franchise: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                  status: true,
                  location: true,
                  ownership_document: true,
                  financial_statement: true,
                  proposal: true,
                  sales_location: true,
                  equipment: true,
                  materials: true,
                },
              },
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
            },
          },
        },
      });

      await tx.user_notifications.create({
        data: {
          user_id: updated.purchase.user.id,
          title: "Status Permintaan Pendanaan Diperbarui",
          message: `Status permintaan pendanaan untuk franchise ${updated.purchase.franchise.name} telah diperbarui menjadi ${status}.`,
          type: "funding_request",
          is_read: false,
          sent_at: new Date(),
        },
      });

      return { updated };
    });

    return NextResponse.json(
      formatResponse({
        data: updated,
        message: "Successfully updated funding request status",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error updating funding requests.", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole([Role.ADMIN, Role.FRANCHISEE]);

    if ("error" in auth) {
      return NextResponse.json(formatError({ message: auth.error }), {
        status: auth.status,
      });
    }

    const body = await req.json();

    if (!body)
      return NextResponse.json(
        { error: "Request body is missing" },
        { status: 400 }
      );

    const requiredFields = [
      "confirmation_status",
      "address",
      "phone_number",
      "npwp",
      "franchise_address",
      "ktp",
      "foto_diri",
      "foto_lokasi",
      "mou_franchisor",
      "mou_modal",
    ];

    for (const field of requiredFields) {
      const value = body[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return NextResponse.json(
          { error: `${field} is missing` },
          { status: 400 }
        );
      }
    }

    const { id } = await params;
    const funding_request = await prisma.funding_request.findUnique({
      where: { id },
      include: {
        purchase: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!funding_request) {
      return NextResponse.json(
        formatError({ message: "Funding Request not found" }),
        {
          status: 404,
        }
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth.user as any).role === Role.FRANCHISEE &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      funding_request.purchase.user_id != (auth.user as any).id
    ) {
      return NextResponse.json(
        formatError({ message: "Unauthorized access" }),
        {
          status: 401,
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

    const admins = await prisma.users.findMany({
      where: {
        role: Role.ADMIN,
      },
    });

    const { updated } = await prisma.$transaction(async (tx) => {
      const updated = await tx.funding_request.update({
        where: { id: funding_request.id },
        data: {
          ...body,
        },
        include: {
          purchase: {
            select: {
              id: true,
              purchase_type: true,
              confirmation_status: true,
              payment_status: true,
              paid_at: true,
              franchise: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                  status: true,
                  location: true,
                  ownership_document: true,
                  financial_statement: true,
                  proposal: true,
                  sales_location: true,
                  equipment: true,
                  materials: true,
                },
              },
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
            },
          },
        },
      });

      await tx.user_notifications.createMany({
        data: admins.map((admin) => ({
          user_id: admin.id,
          title: "Update Data Funding Request",
          message: `${updated.purchase.user.name} telah menambahkan MoU untuk permintaan pendanaan franchise ${updated.purchase.franchise.name}.`,
          type: "funding_request",
          is_read: false,
          sent_at: new Date(),
        })),
      });

      return { updated };
    });

    return NextResponse.json(
      formatResponse({
        data: updated,
        message: "Successfully updated funding request status",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error updating funding requests.", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
