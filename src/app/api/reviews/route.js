import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 });
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("GET /api/reviews error", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, role, rating, text, tourType, tourDescription } = body;

    if (!name || !role || !rating || !text || !tourType || !tourDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const review = await Review.create({ name, role, rating, text, tourType, tourDescription });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("POST /api/reviews error", err);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, role, avatar, rating, text, tourType, tourDescription, tourImage, gradientColor } = body;

    if (!id) return NextResponse.json({ error: "Review ID required" }, { status: 400 });

    await connectDB();
    const review = await Review.findById(id);
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    review.name = name ?? review.name;
    review.role = role ?? review.role;
    review.avatar = avatar ?? review.avatar;
    review.rating = rating ?? review.rating;
    review.text = text ?? review.text;
    review.tourType = tourType ?? review.tourType;
    review.tourDescription = tourDescription ?? review.tourDescription;
    review.tourImage = tourImage ?? review.tourImage;
    review.gradientColor = gradientColor ?? review.gradientColor;

    await review.save();
    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("PUT /api/reviews error", err);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Review ID required" }, { status: 400 });

    await connectDB();
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/reviews error", err);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
