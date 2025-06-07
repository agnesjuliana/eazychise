import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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

    const res = NextResponse.json({
      success: true,
      data: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        status: user?.status,
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
    const data = await request.json();

    const updateUser = await prisma.users.update({
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

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: {
        id: updateUser.id,
        name: updateUser.name,
        email: updateUser.email,
        role: updateUser.role,
        status: updateUser.status,
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
