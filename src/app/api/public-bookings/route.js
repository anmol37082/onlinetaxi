import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PublicBooking from '@/models/PublicBooking';

// POST /api/public-bookings - Create new public booking
export async function POST(request) {
  try {
    await dbConnect();

    const bookingData = await request.json();

    // Validate required fields
    const { service_type, trip_type, travel_date, customer_phone } = bookingData;

    if (!service_type || !trip_type || !travel_date || !customer_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create booking
    const booking = new PublicBooking(bookingData);
    await booking.save();

    return NextResponse.json({
      message: 'Booking created successfully',
      booking: {
        _id: booking._id,
        bookingReference: booking.bookingReference,
        service_type: booking.service_type,
        trip_type: booking.trip_type,
        travel_date: booking.travel_date,
        customer_phone: booking.customer_phone,
        status: booking.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating public booking:', error);

    if (error.code === 11000) {
      return NextResponse.json({ error: 'Booking reference already exists' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
