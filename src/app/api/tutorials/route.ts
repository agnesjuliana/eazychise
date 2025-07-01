import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { CreateTutorialPayload } from "@/type/tutorial";
import { formatResponse, formatError } from "@/utils/response";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const auth = await requireRole(Role.FRANCHISOR);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const franchisorId = (auth.user as any).id;

  const franchise = await prisma.franchise_listings.findFirst({
    where: {
      franchisor_id: franchisorId,
    },
    select: {
      id: true,
    },
  });

  if (!franchise) {
    return NextResponse.json(
      formatError({ message: "Franchise not found for this user" }),
      { status: 404 }
    );
  }

  try {
    const body = (await req.json()) as CreateTutorialPayload;

    const created = await prisma.listing_documents.create({
      data: {
        id_franchise: franchise.id,
        name: body.name,
        path: body.path,
        type: body.type,
      },
    });

    return NextResponse.json(
      formatResponse({
        message: "Tutorial created successfully",
        data: created,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating tutorial:", err);
    return NextResponse.json(
      formatError({ message: "Failed to create tutorial" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  const auth = await requireRole([Role.FRANCHISOR]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  try {
    // Ambil franchise yang dimiliki oleh franchisor ini
    const franchise = await prisma.franchise_listings.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: { franchisor_id: (auth.user as any).id },
    });

    if (!franchise) {
      return NextResponse.json(
        formatResponse({ data: [], message: "No franchise found" }),
        {
          status: 200,
        }
      );
    }

    const tutorials = await prisma.listing_documents.findMany({
      where: {
        id_franchise: franchise.id,
        type: "GUIDELINES",
      },
      select: {
        id: true,
        name: true,
        path: true,
        type: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      formatResponse({ data: tutorials, message: "Success get tutorials" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /tutorials error:", err);
    return NextResponse.json(
      formatError({ message: "Failed to get tutorials" }),
      {
        status: 500,
      }
    );
  }
}
