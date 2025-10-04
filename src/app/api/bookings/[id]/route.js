import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

// GET /api/bookings/[id] - Get single booking by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    // Check for token in Authorization header first, then in cookies
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      token = request.cookies.get('token')?.value;
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Invalid token:', err);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const booking = await Booking.findOne({
      _id: id,
      userId: decoded.userId
    })
    .populate('routeId', 'title image fromCity toCity distance duration carType carOptions')
    .populate('tourId', 'title image duration price days summaryText travelTips');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] - Cancel booking by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    // Check for token in Authorization header first, then in cookies
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      token = request.cookies.get('token')?.value;
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Invalid token:', err);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find the booking
    const booking = await Booking.findOne({
      _id: id,
      userId: decoded.userId
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if booking can be cancelled (only pending bookings)
    if (booking.status !== 'pending') {
      return NextResponse.json({
        error: 'Only pending bookings can be cancelled'
      }, { status: 400 });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking: {
        _id: booking._id,
        status: booking.status,
        title: booking.title,
        bookingReference: booking.bookingReference
      }
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
