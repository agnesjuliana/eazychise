import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const auth = await requireRole(["FRANCHISEE", "ADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { slug: categoryId } = params;

  const franchises = await prisma.franchise_listings.findMany({
    where: {
      franchise_categories: {
        some: {
          category_id: categoryId,
        },
      },
    },
    include: {
      franchisor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ data: franchises }, { status: 200 });
}