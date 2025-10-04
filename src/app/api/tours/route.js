import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tour from "@/models/Tour";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    let tour;
    if (slug) {
      tour = await Tour.findOne({ slug });
      if (!tour) {
        if (/^[0-9a-fA-F]{24}$/.test(slug)) {
          tour = await Tour.findById(slug);
        }
      }
      if (!tour) {
        return NextResponse.json({ error: "Tour not found" }, { status: 404 });
      }
      return NextResponse.json({ tour }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    } else {
      const tours = await Tour.find().sort({ createdAt: -1 });
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

    await dbConnect();
    const tour = new Tour({ title, description, image, tag, duration, price, rating, days, summaryTitle, summaryText, travelTipsTitle, travelTips, closingParagraph, slug });
    await tour.save();

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

    await dbConnect();
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

    await dbConnect();
    await Tour.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/tours error", err);
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}
