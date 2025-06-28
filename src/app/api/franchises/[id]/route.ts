import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";
import {
  FranchiseUpdatePayload,
  ListingDocuments,
  ListingHighlight,
} from "@/type/franchise";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
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

  const { id: franchiseId } = params;

  try {
    const franchise = await prisma.franchise_listings.findUnique({
      where: { id: franchiseId },
      include: {
        franchisor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        listing_documents: {
          select: {
            id: true,
            type: true,
            name: true,
            path: true,
          },
        },
        listings_highlights: {
          select: {
            id: true,
            title: true,
            content: true,
          },
        },
      },
    });

    if (!franchise) {
      return NextResponse.json(
        formatError({ message: "Franchise not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(
      formatResponse({
        message: "Success get franchise detail",
        data: franchise,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /franchises/:id error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to fetch franchise detail" }),
      { status: 500 }
    );
  }
}

// PUT api/franchises/:id
export async function PUT(req: Request, context: { params: { id: string } }) {
  const auth = await requireRole([Role.FRANCHISOR]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  const { id } = context.params;
  const body: FranchiseUpdatePayload = await req.json();

  try {
    // Validate request body
    // Franchise data
    const f = body;
    if (!f)
      return NextResponse.json(
        { error: "Franchise data is missing" },
        { status: 400 }
      );

    const franchiseChecks = [
      ["name", f.name],
      ["price", f.price],
      ["image", f.image],
      ["status", f.status],
      ["location", f.location],
      ["ownership_document", f.ownership_document],
      ["financial_statement", f.financial_statement],
      ["proposal", f.proposal],
      ["sales_location", f.sales_location],
      ["equipment", f.equipment],
      ["materials", f.materials],
    ];

    for (const [field, value] of franchiseChecks) {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return NextResponse.json(
          { error: `Franchise ${field} is missing` },
          { status: 400 }
        );
      }
    }

    if (
      !Array.isArray(f.listing_documents) ||
      f.listing_documents.length === 0
    ) {
      return NextResponse.json(
        { error: "Franchise listing documents are missing or invalid" },
        { status: 400 }
      );
    }

    for (const [i, doc] of f.listing_documents.entries()) {
      if (!doc.name)
        return NextResponse.json(
          { error: `Listing document #${i + 1} name is missing` },
          { status: 400 }
        );
      if (!doc.path)
        return NextResponse.json(
          { error: `Listing document #${i + 1} path is missing` },
          { status: 400 }
        );
    }

    if (
      !Array.isArray(f.listing_highlights) ||
      f.listing_highlights.length === 0
    ) {
      return NextResponse.json(
        { error: "Franchise listing highlights are missing or invalid" },
        { status: 400 }
      );
    }

    for (const [i, highlight] of f.listing_highlights.entries()) {
      if (!highlight.title)
        return NextResponse.json(
          { error: `Listing highlight #${i + 1} title is missing` },
          { status: 400 }
        );
      if (!highlight.content)
        return NextResponse.json(
          { error: `Listing highlight #${i + 1} content is missing` },
          { status: 400 }
        );
    }

    // Start Transaction
    const { franchise, documents, highlights } = await prisma.$transaction(
      async (tx) => {
        // Update franchise_listings
        const franchise = await tx.franchise_listings.update({
          where: { id },
          data: {
            name: body.name,
            price: body.price,
            image: body.image,
            status: body.status,
            location: body.location,
            ownership_document: body.ownership_document,
            financial_statement: body.financial_statement,
            proposal: body.proposal,
            sales_location: body.sales_location,
            equipment: body.equipment,
            materials: body.materials,
          },
        });

        // Update listing_documents
        const documents: ListingDocuments[] = [];
        for (const doc of body.listing_documents) {
          documents.push(
            await tx.listing_documents.upsert({
              where: { id: doc.id },
              update: {
                type: doc.type,
                name: doc.name,
                path: doc.path,
              },
              create: {
                id: doc.id,
                id_franchise: franchise.id,
                type: doc.type,
                name: doc.name,
                path: doc.path,
              },
            })
          );
        }

        // Update listing_highlights
        const highlights: ListingHighlight[] = [];
        for (const highlight of body.listing_highlights) {
          highlights.push(
            await tx.listings_highlights.upsert({
              where: { id: highlight.id },
              update: {
                title: highlight.title,
                content: highlight.content,
              },
              create: {
                id: highlight.id,
                id_franchise: franchise.id,
                title: highlight.title,
                content: highlight.content,
              },
            })
          );
        }

        return { franchise, documents, highlights };
      }
    );

    return NextResponse.json(
      formatResponse({
        message: "Franchise updated successfully",
        data: {
          ...franchise,
          listing_documents: documents,
          listing_highlights: highlights,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE FRANCHISE ERROR:", error);
    return NextResponse.json(
      formatError({ message: "Failed to update franchise" }),
      { status: 500 }
    );
  }
}
