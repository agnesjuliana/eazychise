import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-api-backup";
import { formatResponse, formatError } from "@/utils/response";

const prisma = new PrismaClient();

export async function GET() {
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

    const notification = await prisma.user_notifications.findMany({
      where: {
        user_id: user.id,
      },
    });

    const resp = notification.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      is_read: notification.is_read,
      sent_at: notification.sent_at,
    }));

    const meta = {
      count: resp.length,
    };

    return NextResponse.json(
      formatResponse({
        data: resp,
        message: "Successfully get all notifications",
        meta: meta,
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function PATCH() {
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

    await prisma.user_notifications.updateMany({
      where: {
        user_id: user.id,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });

    return NextResponse.json(
      formatResponse({
        message: "Successfully update all notifications to read",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error updating notifications:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
