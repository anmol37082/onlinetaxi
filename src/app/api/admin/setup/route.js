import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(req) {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ adminId: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: "Admin user already exists"
      });
    }

    // Create default admin user
    const admin = new Admin({
      adminId: 'admin',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin',
      isActive: true
    });

    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Default admin user created successfully!",
      credentials: {
        adminId: 'admin',
        password: 'admin123'
      }
    });

  } catch (error) {
    console.error("Setup admin error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
