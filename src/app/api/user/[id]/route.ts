import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { type UpdateUserPayload, type FranchisorProfile } from "@/type/user";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: {
        id: id,
      },
    });

    let detail = null;
    if (user?.role === "FRANCHISOR") {
      detail = await prisma.franchisor_profiles.findUnique({
        where: {
          user_id: id,
        },
      });
    }

    let franchise = null;
    if (user?.role === "FRANCHISOR") {
      franchise = await prisma.franchise_listings.findFirst({
        where: {
          franchisor_id: id,
        },
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
    }

    const res = NextResponse.json({
      success: true,
      data: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        status: user?.status,
        detail:
          user?.role === "FRANCHISOR"
            ? {
                id: detail?.id || undefined,
                ktp: detail?.ktp || undefined,
                foto_diri: detail?.foto_diri || undefined,
              }
            : undefined,
        franchise:
          user?.role === "FRANCHISOR"
            ? {
                ...franchise,
              }
            : undefined,
      },
    });
    return res;
  } catch (err: unknown) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is not found" },
        { status: 400 }
      );
    }
    const data: UpdateUserPayload = await request.json();

    // Start transaction
    const { user, profile } = await prisma.$transaction(async (tx) => {
      const user = await tx.users.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status,
        },
      });

      let profile: FranchisorProfile | null = null;

      if (user.role === "FRANCHISOR") {
        profile = await tx.franchisor_profiles.update({
          where: {
            user_id: id,
          },
          data: {
            ktp: data.profile?.ktp || undefined,
            foto_diri: data.profile?.foto_diri || undefined,
          },
        });
      }

      return { user, profile };
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profile:
          user.role === "FRANCHISOR"
            ? {
                id: profile?.id || undefined,
                ktp: profile?.ktp || undefined,
                foto_diri: profile?.foto_diri || undefined,
              }
            : undefined,
      },
    });
  } catch (err: unknown) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}
