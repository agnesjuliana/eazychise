// BACKEND authentication and authorization
// This file handles user session management and role-based access control
// src/lib/auth.ts
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSessionUser() {
  // ⛏ FIX: await cookies() to avoid warning
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie.value);

    const user = await prisma.users.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error parsing session or fetching user:", error);
    return null;
  }
}

// Define user roles
export type Roles = "ADMIN" | "FRANCHISOR" | "FRANCHISEE";

// Access control by role (single or array)
export async function requireRole(
  allowedRoles: Roles[] | Roles
): Promise<{ user: unknown } | { error: string; status: number }> {
  const user = await getSessionUser();

  if (!user) {
    return { error: "Unauthorized: No active session", status: 401 };
  }

  if (user.status !== "ACCEPTED") {
    return { error: "Access denied: Inactive user status", status: 403 };
  }

  const rolesArray = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  if (!rolesArray.includes(user.role)) {
    return {
      error: "Access denied: Insufficient role privileges",
      status: 403,
    };
  }

  return { user };
}
