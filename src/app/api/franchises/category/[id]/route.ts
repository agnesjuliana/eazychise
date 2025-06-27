import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api-backup";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";
import { buildMeta } from "@/utils/pagination";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
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

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "10");
    const sort = searchParams.get("sort") || "asc";
    const sort_by = searchParams.get("sort_by") || "id";

    const category_id = params.slug;

    const total_data = await prisma.franchise_listings.count({
      where: {
        franchise_categories: {
          some: {
            category_id,
          },
        },
      },
    });

    const skip = (page - 1) * per_page;

    const franchises = await prisma.franchise_listings.findMany({
      where: {
        franchise_categories: {
          some: {
            category_id,
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
      orderBy: {
        [sort_by]: sort,
      },
      skip,
      take: per_page,
    });

    const meta = buildMeta({
      page,
      per_page,
      total_data,
      sort,
      sort_by,
      filter_by: "category_id",
    });

    return NextResponse.json(
      formatResponse({
        message: "Success get franchise by category",
        data: franchises,
        meta,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /franchises/category/:slug error:", err);
    return NextResponse.json(formatError({ message: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
