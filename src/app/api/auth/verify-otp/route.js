import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Otp from "../../../../models/Otp";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 });

    await connectDB();

    const otpDoc = await Otp.findOne({ email, code });
    if (!otpDoc) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    if (new Date() > new Date(otpDoc.expiresAt)) {
      await Otp.deleteMany({ email });
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    await Otp.deleteMany({ email });

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const res = NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, phone: user.phone, address: user.address }
    });

    // ✅ Cookie me JWT set karo
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 din
    });

    return res;
  } catch (err) {
    console.error("verify-otp error", err);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
