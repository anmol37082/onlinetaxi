import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tour from "@/models/Tour";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    let tours;
    if (slug) {
      // Try to find by slug first, then by _id if slug is not found
      tours = await Tour.findOne({ slug });
      if (!tours) {
        // Only try findById if slug is a valid ObjectId
        if (/^[0-9a-fA-F]{24}$/.test(slug)) {
          tours = await Tour.findById(slug);
        }
      }
      if (!tours) {
        return NextResponse.json({ error: "Tour not found" }, { status: 404 });
      }
      return NextResponse.json({ tour: tours }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    } else {
      tours = await Tour.find().sort({ createdAt: -1 });
      return NextResponse.json({ tours }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }
  } catch (err) {
    console.error("GET /api/tours error", err);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, image, tag, duration, price, rating, days, summaryTitle, summaryText, travelTipsTitle, travelTips, closingParagraph, slug } = body;

    if (!title || !description || !image || !tag) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const tour = await Tour.create({ title, description, image, tag, duration, price, rating, days, summaryTitle, summaryText, travelTipsTitle, travelTips, closingParagraph, slug });

    return NextResponse.json({ success: true, tour });
  } catch (err) {
    console.error("POST /api/tours error", err);
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, description, image, tag, duration, price, rating, days, summaryTitle, summaryText, travelTipsTitle, travelTips, closingParagraph, slug } = body;

    if (!id) return NextResponse.json({ error: "Tour ID required" }, { status: 400 });

    await connectDB();
    const tour = await Tour.findById(id);
    if (!tour) return NextResponse.json({ error: "Tour not found" }, { status: 404 });

    tour.title = title ?? tour.title;
    tour.description = description ?? tour.description;
    tour.image = image ?? tour.image;
    tour.tag = tag ?? tour.tag;
    tour.duration = duration ?? tour.duration;
    tour.price = price ?? tour.price;
    tour.rating = rating ?? tour.rating;
    tour.days = days ?? tour.days;
    tour.summaryTitle = summaryTitle ?? tour.summaryTitle;
    tour.summaryText = summaryText ?? tour.summaryText;
    tour.travelTipsTitle = travelTipsTitle ?? tour.travelTipsTitle;
    tour.travelTips = travelTips ?? tour.travelTips;
    tour.closingParagraph = closingParagraph ?? tour.closingParagraph;
    tour.slug = slug ?? tour.slug;

    await tour.save();
    return NextResponse.json({ success: true, tour });
  } catch (err) {
    console.error("PUT /api/tours error", err);
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Tour ID required" }, { status: 400 });

    await connectDB();
    await Tour.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/tours error", err);
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}
