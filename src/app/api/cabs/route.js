import dbConnect from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const distinctCars = searchParams.get("distinctCars");

    const client = await dbConnect();
    const db = client.db("Onlinetaxi");

    if (distinctCars === "true") {
      // Return distinct car names only
      const cars = await db.collection("carrs").distinct("Car");
      return new Response(
        JSON.stringify({ success: true, cars }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Otherwise, return last 5 added cabs
    const cabs = await db
      .collection("carrs")
      .find({})
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    return new Response(
      JSON.stringify({ success: true, cabs }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    const client = await dbConnect();
    const db = client.db("Onlinetaxi");

    // Insert new cab
    const result = await db.collection("carrs").insertOne(data);

    return new Response(
      JSON.stringify({ success: true, message: "Cab added", id: result.insertedId }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const { car, imgg } = data;

    if (!car || !imgg) {
      return new Response(
        JSON.stringify({ success: false, error: "car and imgg fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await dbConnect();
    const db = client.db("Onlinetaxi");

    // Collections to update
    const collections = ["carrs", "roundtrips", "hourlytrips"];
    let totalModifiedCount = 0;

    // Update image for all cabs with given car type in all collections (case-insensitive)
    for (const collectionName of collections) {
      const result = await db.collection(collectionName).updateMany(
        { Car: { $regex: new RegExp(`^${car}$`, "i") } },
        { $set: { Imgg: imgg } }
      );
      totalModifiedCount += result.modifiedCount;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Image updated",
        modifiedCount: totalModifiedCount,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
