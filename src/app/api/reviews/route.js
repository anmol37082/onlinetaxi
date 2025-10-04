import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    const reviews = await db.collection("reviews").find().sort({ createdAt: -1 }).toArray();
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

    await dbConnect();
    const db = mongoose.connection.db;
    const review = await db.collection("reviews").insertOne({ name, role, rating, text, tourType, tourDescription, createdAt: new Date() });

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

    await dbConnect();
    const db = mongoose.connection.db;
    const review = await db.collection("reviews").findOne({ _id: new ObjectId(id) });
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    const updatedReview = {
      name: name ?? review.name,
      role: role ?? review.role,
      avatar: avatar ?? review.avatar,
      rating: rating ?? review.rating,
      text: text ?? review.text,
      tourType: tourType ?? review.tourType,
      tourDescription: tourDescription ?? review.tourDescription,
      tourImage: tourImage ?? review.tourImage,
      gradientColor: gradientColor ?? review.gradientColor,
    };

    await db.collection("reviews").updateOne({ _id: new ObjectId(id) }, { $set: updatedReview });
    return NextResponse.json({ success: true, review: updatedReview });
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

    await dbConnect();
    const db = mongoose.connection.db;
    await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/reviews error", err);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
