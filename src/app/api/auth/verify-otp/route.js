import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 });

    const client = await dbConnect();
    const db = client.connection.db;

    const otpDoc = await db.collection("otps").findOne({ email, code });
    if (!otpDoc) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    if (new Date() > new Date(otpDoc.expiresAt)) {
      await db.collection("otps").deleteMany({ email });
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    await db.collection("otps").deleteMany({ email });

    let user = await db.collection("users").findOne({ email });
    if (!user) {
      const insertResult = await db.collection("users").insertOne({ email });
      user = { _id: insertResult.insertedId, email };
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const res = NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, phone: user.phone, address: user.address }
    });

    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return res;
  } catch (err) {
    console.error("verify-otp error", err);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
