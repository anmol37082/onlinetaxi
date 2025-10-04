import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LoginHistory from '@/models/LoginHistory';
import { verifyToken } from '@/lib/cookies';

export async function GET(request) {
  try {
    await dbConnect();

    // Verify user authentication
    const tokenData = verifyToken(request);
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get login history for the user
    const history = await LoginHistory.find({
      userId: tokenData.userId
    })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .select('action ipAddress location deviceInfo timestamp sessionDuration');

    // Get total count for pagination
    const total = await LoginHistory.countDocuments({
      userId: tokenData.userId
    });

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Login history fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
