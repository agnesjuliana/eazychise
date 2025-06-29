import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { EventPayload } from "@/type/events";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(
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
    const body: EventPayload = await req.json();

    const existing = await prisma.events.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(formatError({ message: "Event not found" }), {
        status: 404,
      });
    }

    const updated = await prisma.events.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price,
        datetime: body.datetime,
        image: body.image,
      },
    });

    return NextResponse.json(
      formatResponse({
        data: updated,
        message: "Successfully updated event",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error updating event:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
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

    const event = await prisma.events.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json(formatError({ message: "Event not found" }), {
        status: 404,
      });
    }

    await prisma.events.delete({ where: { id } });

    return NextResponse.json(
      formatResponse({
        data: { id },
        message: "Successfully deleted event",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error deleting event:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
