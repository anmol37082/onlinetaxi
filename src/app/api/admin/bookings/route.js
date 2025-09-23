import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { sendBookingConfirmationEmail, sendTripStartedEmail, sendTripCompletedEmail } from '@/lib/mail';
import { verifyAdminToken } from '@/lib/cookies';

// GET /api/admin/bookings - Get all bookings (admin only)
export async function GET(request) {
  try {
    await connectDB();

    // Check for admin authentication
    const adminData = verifyAdminToken(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search');

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { bookingReference: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'email name')
        .populate('routeId', 'title image')
        .populate('tourId', 'title image'),
      Booking.countDocuments(query)
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });

  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/bookings - Update booking status (admin only)
export async function PUT(request) {
  try {
    await connectDB();

    // Check for admin authentication
    const adminData = verifyAdminToken(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, status, adminNotes } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json({ error: 'Booking ID and status are required' }, { status: 400 });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Add timestamp based on status
    if (status === 'confirmed') {
      updateData.confirmedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    )
    .populate('userId', 'email name')
    .populate('routeId', 'title image')
    .populate('tourId', 'title image');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Send email notifications based on status changes
    if (status === 'confirmed') {
      try {
        await sendBookingConfirmationEmail({
          userEmail: booking.userEmail,
          userName: booking.userName,
          bookingReference: booking.bookingReference,
          title: booking.title,
          travelDate: booking.travelDate,
          status: booking.status
        });
        console.log(`Booking confirmation email sent to ${booking.userEmail}`);
      } catch (emailError) {
        console.error('Error sending booking confirmation email:', emailError);
        // Don't fail the request if email fails, just log the error
      }
    } else if (status === 'in-progress') {
      try {
        await sendTripStartedEmail({
          userEmail: booking.userEmail,
          userName: booking.userName,
          bookingReference: booking.bookingReference,
          title: booking.title,
          travelDate: booking.travelDate
        });
        console.log(`Trip started email sent to ${booking.userEmail}`);
      } catch (emailError) {
        console.error('Error sending trip started email:', emailError);
        // Don't fail the request if email fails, just log the error
      }
    } else if (status === 'completed') {
      try {
        await sendTripCompletedEmail({
          userEmail: booking.userEmail,
          userName: booking.userName,
          bookingReference: booking.bookingReference,
          title: booking.title,
          travelDate: booking.travelDate,
          completedAt: booking.completedAt
        });
        console.log(`Trip completed email sent to ${booking.userEmail}`);
      } catch (emailError) {
        console.error('Error sending trip completed email:', emailError);
        // Don't fail the request if email fails, just log the error
      }
    }

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
