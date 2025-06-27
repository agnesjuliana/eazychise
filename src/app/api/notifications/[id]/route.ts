import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-api";
import { formatResponse, formatError } from "@/utils/response";

const prisma = new PrismaClient();

export async function GET({ params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        formatError({ message: "Unauthorized Access" }),
        {
          status: 401,
        }
      );
    }

    const id = params.id;

    const notification = await prisma.user_notifications.findUnique({
      where: {
        id,
        user_id: user.id,
      },
    });

    if (!notification) {
      return NextResponse.json(
        formatError({ message: "Notification not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(
      formatResponse({
        data: notification,
        message: "Successfully get notifications",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function PATCH({ params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        formatError({ message: "Unauthorized Access" }),
        {
          status: 401,
        }
      );
    }

    const id = params.id;

    await prisma.user_notifications.update({
      where: {
        id: id,
        user_id: user.id,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });

    return NextResponse.json(
      formatResponse({
        message: "Successfully update notifications to read",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error updating notifications:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
