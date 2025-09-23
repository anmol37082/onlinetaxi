import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const res = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });

    // Clear admin token cookie
    res.cookies.set({
      name: "adminToken",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
