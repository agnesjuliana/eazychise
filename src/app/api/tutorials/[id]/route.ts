import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole, getSessionUser } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";
import { CreateTutorialPayload } from "@/type/tutorial";

const prisma = new PrismaClient();

export async function PUT(req: Request, context: { params: { id: string } }) {
  const auth = await requireRole([Role.FRANCHISOR]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(formatError({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const tutorialId = context.params.id;
  const body = (await req.json()) as Partial<CreateTutorialPayload>;

  try {
    // Validasi kepemilikan dokumen oleh franchisor
    const franchise = await prisma.franchise_listings.findFirst({
      where: { franchisor_id: user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        formatError({ message: "Franchise not found" }),
        {
          status: 404,
        }
      );
    }

    const existing = await prisma.listing_documents.findUnique({
      where: { id: tutorialId },
    });

    if (
      !existing ||
      existing.id_franchise !== franchise.id ||
      existing.type !== "GUIDELINES"
    ) {
      return NextResponse.json(
        formatError({ message: "Tutorial not found or unauthorized" }),
        {
          status: 403,
        }
      );
    }

    const updated = await prisma.listing_documents.update({
      where: { id: tutorialId },
      data: {
        name: body.name || existing.name,
        path: body.path || existing.path,
      },
    });

    return NextResponse.json(
      formatResponse({ message: "Tutorial updated", data: updated }),
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /tutorials/:id error:", err);
    return NextResponse.json(
      formatError({ message: "Failed to update tutorial" }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  const auth = await requireRole([Role.FRANCHISOR]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(formatError({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const tutorialId = context.params.id;

  try {
    const franchise = await prisma.franchise_listings.findFirst({
      where: { franchisor_id: user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        formatError({ message: "Franchise not found" }),
        {
          status: 404,
        }
      );
    }

    const existing = await prisma.listing_documents.findUnique({
      where: { id: tutorialId },
    });

    if (
      !existing ||
      existing.id_franchise !== franchise.id ||
      existing.type !== "GUIDELINES"
    ) {
      return NextResponse.json(
        formatError({ message: "Tutorial not found or unauthorized" }),
        {
          status: 403,
        }
      );
    }

    await prisma.listing_documents.delete({
      where: { id: tutorialId },
    });

    return NextResponse.json(
      formatResponse({ message: "Tutorial deleted successfully", data: null }),
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /tutorials/:id error:", err);
    return NextResponse.json(
      formatError({ message: "Failed to delete tutorial" }),
      {
        status: 500,
      }
    );
  }
}
