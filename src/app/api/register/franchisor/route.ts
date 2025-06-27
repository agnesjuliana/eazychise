import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { FranchisorRegistrationPayload } from "@/type/registration";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body: FranchisorRegistrationPayload = await req.json();

    // Top-level checks
    if (!body.name)
      return NextResponse.json({ error: "Name is missing" }, { status: 400 });
    if (!body.email)
      return NextResponse.json({ error: "Email is missing" }, { status: 400 });
    if (!body.password)
      return NextResponse.json(
        { error: "Password is missing" },
        { status: 400 }
      );

    // Franchisor data
    if (!body.franchisor_data?.ktp)
      return NextResponse.json(
        { error: "Franchisor KTP is missing" },
        { status: 400 }
      );
    if (!body.franchisor_data?.foto_diri)
      return NextResponse.json(
        { error: "Franchisor photo is missing" },
        { status: 400 }
      );

    // Franchise data
    const f = body.franchise_data;
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
      if (!value && value !== 0) {
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

    const existing = await prisma.users.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(body.password, 10);

    const { user, profile, franchise, highlights, documents } =
      await prisma.$transaction(async (tx) => {
        const user = await tx.users.create({
          data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: "FRANCHISOR",
            status: "WAITING", // Default status for new users
          },
        });

        const profile = await tx.franchisor_profiles.create({
          data: {
            user_id: user.id,
            ktp: body.franchisor_data.ktp,
            foto_diri: body.franchisor_data.foto_diri,
          },
        });

        const franchise_data = body.franchise_data;

        const franchise = await tx.franchise_listings.create({
          data: {
            franchisor_id: user.id,
            confirmation_status: "WAITING",
            name: franchise_data.name,
            price: franchise_data.price,
            image: franchise_data.image,
            status: franchise_data.status,
            location: franchise_data.location,
            ownership_document: franchise_data.ownership_document,
            financial_statement: franchise_data.financial_statement,
            proposal: franchise_data.proposal,
            sales_location: franchise_data.sales_location,
            equipment: franchise_data.equipment,
            materials: franchise_data.materials,
          },
        });

        const highlights: Awaited<
          ReturnType<typeof tx.listings_highlights.create>
        >[] = [];

        for (const [
          ,
          highlight,
        ] of franchise_data.listing_highlights.entries()) {
          highlights.push(
            await tx.listings_highlights.create({
              data: {
                id_franchise: franchise.id,
                title: highlight.title,
                content: highlight.content,
              },
            })
          );
        }

        const documents: Awaited<
          ReturnType<typeof tx.listing_documents.create>
        >[] = [];

        for (const [, document] of franchise_data.listing_documents.entries()) {
          documents.push(
            await tx.listing_documents.create({
              data: {
                id_franchise: franchise.id,
                type: "PENDUKUNG",
                name: document.name,
                path: document.path,
              },
            })
          );
        }

        return { user, profile, franchise, highlights, documents };
      });

    const resp = {
      ...user,
      franchisor_data: profile,
      franchise_data: {
        ...franchise,
        listing_documents: documents,
        listing_highlihgts: highlights,
      },
    };

    return NextResponse.json({ success: true, data: resp }, { status: 201 });
  } catch (err: unknown) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
