import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import Profile from '@/models/Profile';
import TopRoute from '@/models/TopRoute';
import Tour from '@/models/Tour';
import jwt from 'jsonwebtoken';

// GET /api/bookings - Get user's bookings
export async function GET(request) {
  try {
    await dbConnect();

    // Check for token in Authorization header first, then in cookies
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      // Try multiple ways to get the token from cookies
      token = request.cookies.get('token')?.value;

      // If not found, try parsing the cookie header manually
      if (!token) {
        const cookieHeader = request.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);
        token = tokenMatch ? tokenMatch[1] : null;
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token found' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Invalid token:', err);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bookings = await Booking.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .populate('routeId', 'title image')
      .populate('tourId', 'title image');

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bookings - Create new booking
export async function POST(request) {
  try {
    await dbConnect();

    // Check for token in Authorization header first, then in cookies
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      // Try multiple ways to get the token from cookies
      token = request.cookies.get('token')?.value;

      // If not found, try parsing the cookie header manually
      if (!token) {
        const cookieHeader = request.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);
        token = tokenMatch ? tokenMatch[1] : null;
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token found' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Invalid token:', err);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bookingData = await request.json();

    // Get user profile for auto-fill
    const profile = await Profile.findOne({ email: user.email });

    // Create booking object with auto-filled data
    const booking = new Booking({
      userId: user._id,
      userName: profile?.name || user.name || '',
      userEmail: user.email,
      userPhone: bookingData.userPhone || profile?.phone || '',
      userAddress: profile?.address || '',
      ...bookingData
    });

    await booking.save();

    return NextResponse.json({
      message: 'Booking created successfully',
      booking: {
        _id: booking._id,
        bookingReference: booking.bookingReference,
        title: booking.title,
        price: booking.price,
        travelDate: booking.travelDate,
        status: booking.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);

    if (error.code === 11000) {
      return NextResponse.json({ error: 'Booking reference already exists' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
