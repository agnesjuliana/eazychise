import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create response with success message
    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });

    // Clear all session-related cookies by setting them to expire immediately
    response.cookies.set("session", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0), // Expire immediately
    });

    // Clear additional cookies that might be set by client-side
    response.cookies.set("token", "", {
      path: "/",
      expires: new Date(0),
    });

    response.cookies.set("user", "", {
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat logout",
      },
      { status: 500 }
    );
  }
}
