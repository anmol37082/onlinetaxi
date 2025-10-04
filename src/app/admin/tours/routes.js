import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Tour from "../../../../models/Tour";

export async function POST(req) {
  const body = await req.json();
  try {
    await dbConnect();
    const tour = await Tour.create(body);
    return NextResponse.json({ success: true, tour });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add tour" }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, ...data } = await req.json();
  try {
    await dbConnect();
    const tour = await Tour.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, tour });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  try {
    await dbConnect();
    await Tour.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}
