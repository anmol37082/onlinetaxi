import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

async function getUserFromCookie(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();
    const user = await User.findById(payload.userId);
    return user;
  } catch (err) {
    return null;
  }
}

export async function GET(req) {
  try {
    const user = await getUserFromCookie(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // Check if user has complete profile information
    const isComplete = user && user.name && user.phone && user.address;

    return NextResponse.json({
      success: true,
      profileComplete: isComplete,
      user: {
        name: user.name,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (err) {
    console.error('Profile completion check error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
