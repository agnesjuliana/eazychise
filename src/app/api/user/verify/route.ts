import { PrismaClient, Status } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-api";
import { Role } from "@/type/user";
import { formatError, formatResponse } from "@/utils/response";
import type { UpdateUserStatusPayload } from "@/type/user";

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  const auth = await requireRole([Role.ADMIN]);
  if ("error" in auth) {
    return NextResponse.json(formatError({ message: auth.error }), {
      status: auth.status,
    });
  }

  try {
    const body = (await req.json()) as UpdateUserStatusPayload;

    if (!body.user_id || !body.status) {
      return NextResponse.json(
        formatError({ message: "Missing user_id or status" }),
        { status: 400 }
      );
    }

    const updated = await prisma.users.update({
      where: { id: body.user_id },
      data: { status: body.status as Status },
    });

    return NextResponse.json(
      formatResponse({
        message: "User status updated successfully",
        data: {
          id: updated.id,
          status: updated.status,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /user/verify error:", error);
    return NextResponse.json(
      formatError({ message: "Failed to update user status" }),
      { status: 500 }
    );
  }
}
