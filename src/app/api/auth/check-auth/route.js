import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    // Get user token from Authorization header first, then from cookies
    const authHeader = req.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      // Try multiple ways to get the token from cookies
      token = req.cookies.get("token")?.value;

      // If not found, try parsing the cookie header manually
      if (!token) {
        const cookieHeader = req.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);
        token = tokenMatch ? tokenMatch[1] : null;
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET environment variable is not set");
        return NextResponse.json(
          { error: "Server configuration error" },
          { status: 500 }
        );
      }
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is active (with fallback for existing users)
    if (user.isActive === false) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 401 }
      );
    }

    // Update last login
    await User.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    return NextResponse.json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error("Check auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
