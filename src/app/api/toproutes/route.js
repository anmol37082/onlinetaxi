import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import TopRoute from "../../../models/TopRoute";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    await connectDB();

    if (slug) {
      const toproute = await TopRoute.findOne({ slug });
      if (!toproute) {
        return NextResponse.json({ error: "TopRoute not found" }, { status: 404 });
      }
      return NextResponse.json({ toproute });
    } else {
      const toproutes = await TopRoute.find().sort({ createdAt: -1 });
      return NextResponse.json({ toproutes });
    }
  } catch (err) {
    console.error("GET /api/toproutes error", err);
    return NextResponse.json({ error: "Failed to fetch toproutes" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, slug, image, imageAlt, distance, duration, carType, currentPrice, originalPrice, discount, description, features, fromCity, toCity, introHeading, introParagraph, overviewHeading, overviewParagraph, aboutHeading, aboutParagraph, journeyHeading, journeyParagraph, destinationHeading, destinationParagraph, sightseeing, whyHeading, whyPoints, discoverHeading, discoverParagraph, attractions, bookingHeading, bookingParagraph } = body;

    if (!title || !slug || !image || !imageAlt || !distance || !duration || !carType || !currentPrice || !originalPrice || !discount || !description || !features) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const toproute = await TopRoute.create({ title, slug, image, imageAlt, distance, duration, carType, currentPrice, originalPrice, discount, description, features, fromCity, toCity, introHeading, introParagraph, overviewHeading, overviewParagraph, aboutHeading, aboutParagraph, journeyHeading, journeyParagraph, destinationHeading, destinationParagraph, sightseeing, whyHeading, whyPoints, discoverHeading, discoverParagraph, attractions, bookingHeading, bookingParagraph });

    return NextResponse.json({ success: true, toproute });
  } catch (err) {
    console.error("POST /api/toproutes error", err);
    return NextResponse.json({ error: "Failed to create toproute" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, slug, image, imageAlt, distance, duration, carType, currentPrice, originalPrice, discount, description, features, fromCity, toCity, introHeading, introParagraph, overviewHeading, overviewParagraph, aboutHeading, aboutParagraph, journeyHeading, journeyParagraph, destinationHeading, destinationParagraph, sightseeing, whyHeading, whyPoints, discoverHeading, discoverParagraph, attractions, bookingHeading, bookingParagraph } = body;

    if (!id) return NextResponse.json({ error: "TopRoute ID required" }, { status: 400 });

    await connectDB();
    const toproute = await TopRoute.findById(id);
    if (!toproute) return NextResponse.json({ error: "TopRoute not found" }, { status: 404 });

    toproute.title = title ?? toproute.title;
    toproute.slug = slug ?? toproute.slug;
    toproute.image = image ?? toproute.image;
    toproute.imageAlt = imageAlt ?? toproute.imageAlt;
    toproute.distance = distance ?? toproute.distance;
    toproute.duration = duration ?? toproute.duration;
    toproute.carType = carType ?? toproute.carType;
    toproute.currentPrice = currentPrice ?? toproute.currentPrice;
    toproute.originalPrice = originalPrice ?? toproute.originalPrice;
    toproute.discount = discount ?? toproute.discount;
    toproute.description = description ?? toproute.description;
    toproute.features = features ?? toproute.features;
    toproute.fromCity = fromCity ?? toproute.fromCity;
    toproute.toCity = toCity ?? toproute.toCity;
    toproute.introHeading = introHeading ?? toproute.introHeading;
    toproute.introParagraph = introParagraph ?? toproute.introParagraph;
    toproute.overviewHeading = overviewHeading ?? toproute.overviewHeading;
    toproute.overviewParagraph = overviewParagraph ?? toproute.overviewParagraph;
    toproute.aboutHeading = aboutHeading ?? toproute.aboutHeading;
    toproute.aboutParagraph = aboutParagraph ?? toproute.aboutParagraph;
    toproute.journeyHeading = journeyHeading ?? toproute.journeyHeading;
    toproute.journeyParagraph = journeyParagraph ?? toproute.journeyParagraph;
    toproute.destinationHeading = destinationHeading ?? toproute.destinationHeading;
    toproute.destinationParagraph = destinationParagraph ?? toproute.destinationParagraph;
    toproute.sightseeing = sightseeing ?? toproute.sightseeing;
    toproute.whyHeading = whyHeading ?? toproute.whyHeading;
    toproute.whyPoints = whyPoints ?? toproute.whyPoints;
    toproute.discoverHeading = discoverHeading ?? toproute.discoverHeading;
    toproute.discoverParagraph = discoverParagraph ?? toproute.discoverParagraph;
    toproute.attractions = attractions ?? toproute.attractions;
    toproute.bookingHeading = bookingHeading ?? toproute.bookingHeading;
    toproute.bookingParagraph = bookingParagraph ?? toproute.bookingParagraph;

    await toproute.save();
    return NextResponse.json({ success: true, toproute });
  } catch (err) {
    console.error("PUT /api/toproutes error", err);
    return NextResponse.json({ error: "Failed to update toproute" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "TopRoute ID required" }, { status: 400 });

    await connectDB();
    await TopRoute.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/toproutes error", err);
    return NextResponse.json({ error: "Failed to delete toproute" }, { status: 500 });
  }
}
