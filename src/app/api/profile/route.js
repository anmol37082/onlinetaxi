import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

async function getUserFromCookie(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(payload.userId);
    return user;
  } catch (err) {
    return null;
  }
}

export async function GET(req) {
  try {
    const user = await getUserFromCookie(req);
    if (!user)
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromCookie(req);
    if (!user)
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const body = await req.json();
    const { name, phone, address } = body;

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("profile update error", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
