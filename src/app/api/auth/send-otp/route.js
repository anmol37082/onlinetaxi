import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { sendOtpEmail } from "@/lib/mail";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const client = await dbConnect();
    const db = client.db("Onlinetaxi");

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP (upsert: remove older for same email)
    await db.collection("otps").deleteMany({ email });
    await db.collection("otps").insertOne({ email, code, expiresAt });

    // Send email (fire-and-forget but await for easier debugging)
    await sendOtpEmail(email, code);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("send-otp error", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
