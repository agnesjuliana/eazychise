import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api-backup";
import { EventPayload } from "@/type/events";
import { Role } from "@/type/user";
import { formatResponse, formatError } from "@/utils/response";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.events.findMany();

    const resp = events.map((event) => ({
      id: event.id,
      name: event.name,
      price: event.price,
      datetime: event.datetime,
      image: event.image,
    }));

    const meta = {
      count: resp.length,
    };

    return NextResponse.json(
      formatResponse({
        data: resp,
        message: "Successfully get all events",
        meta: meta,
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error fetching events:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireRole(Role.ADMIN);

    if ("error" in auth) {
      return NextResponse.json(formatError({ message: auth.error }), {
        status: auth.status,
      });
    }

    const body: EventPayload = await req.json();

    if (!body.name)
      return NextResponse.json({ error: "Name is missing" }, { status: 400 });
    if (!body.price)
      return NextResponse.json({ error: "Price is missing" }, { status: 400 });
    if (!body.datetime)
      return NextResponse.json(
        { error: "Event Date is missing" },
        { status: 400 }
      );
    if (!body.image)
      return NextResponse.json({ error: "Image is missing" }, { status: 400 });

    const event = await prisma.events.create({
      data: {
        ...body,
      },
    });

    const resp = {
      ...event,
    };

    return NextResponse.json(
      formatResponse({ data: resp, message: "Successfully created event" }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error creating events:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
