import { PrismaClient, DocumentType } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole([
    Role.FRANCHISOR,
    Role.FRANCHISEE,
    Role.ADMIN,
  ]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  // ✅ Extract params safely to avoid async warning
  const franchiseId = params.id;

  // Get query ?type=GUIDELINES or PENDUKUNG
  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get("type") as DocumentType | null;

  try {
    const documents = await prisma.listing_documents.findMany({
      where: {
        id_franchise: franchiseId,
        ...(typeParam ? { type: typeParam } : {}),
      },
      select: {
        id: true,
        name: true,
        path: true,
        type: true,
      },
    });

    return NextResponse.json(
      formatResponse({
        message: "Success get documents",
        data: documents,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /franchise/:id/document error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to fetch documents" }),
      { status: 500 }
    );
  }
}