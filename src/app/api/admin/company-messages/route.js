import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CompanyMessage from '@/models/CompanyMessage';
import Contact from '@/models/Contact';
import User from '@/models/User';
import { verifyAdminToken } from '@/lib/cookies';

export async function GET(request) {
  try {
    await connectDB();

    // Verify admin authentication
    const adminData = verifyAdminToken(request);
    if (!adminData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get company messages
    const messages = await CompanyMessage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sentBy', 'name email')
      .select('title message type priority status createdAt targetUsers');

    // Get total count for pagination
    const total = await CompanyMessage.countDocuments();

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Company messages fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    // Verify admin authentication
    const adminData = verifyAdminToken(request);
    if (!adminData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, message, type, priority, targetUserIds, scheduledFor, tags } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    // Get target users details
    const targetUsers = [];
    if (targetUserIds && targetUserIds.length > 0) {
      const users = await User.find({ _id: { $in: targetUserIds } })
        .select('_id email name');

      users.forEach(user => {
        targetUsers.push({
          userId: user._id,
          email: user.email,
          name: user.name || user.email.split('@')[0]
        });
      });
    }

    // Create new message
    const newMessage = new CompanyMessage({
      title,
      message,
      type: type || 'general',
      priority: priority || 'medium',
      targetUsers,
      sentBy: adminData.adminId,
      sentByName: adminData.name,
      scheduledFor,
      isScheduled: !!scheduledFor,
      tags: tags || [],
      status: scheduledFor ? 'draft' : 'sent'
    });

    await newMessage.save();

    return NextResponse.json({
      success: true,
      message: 'Company message created successfully',
      data: newMessage
    }, { status: 201 });

  } catch (error) {
    console.error('Company message creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
