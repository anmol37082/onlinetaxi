import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

async function getUserFromCookie(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const client = await dbConnect();
    const db = client.connection.db;
    const user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });
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

    const client = await dbConnect();
    const db = client.connection.db;
    const updatedUser = {
      name: name ?? user.name,
      phone: phone ?? user.phone,
      address: address ?? user.address,
    };

    await db.collection("users").updateOne({ _id: new ObjectId(user._id) }, { $set: updatedUser });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("profile update error", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
