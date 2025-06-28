import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/auth-api";
import { formatResponse, formatError } from "@/utils/response";
import { Role } from "@/type/user";
import { ConfirmationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const auth = await requireRole(Role.ADMIN);

    if ("error" in auth) {
      return NextResponse.json(formatError({ message: auth.error }), {
        status: auth.status,
      });
    }

    const id = context.params.id;

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
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireRole(Role.ADMIN);

    if ("error" in auth) {
      return NextResponse.json(formatError({ message: auth.error }), {
        status: auth.status,
      });
    }

    const funding_request = await prisma.funding_request.findUnique({
      where: { id: params.id },
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

    const updated = await prisma.funding_request.update({
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
