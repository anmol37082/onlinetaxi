import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// ✅ GET (fetch all cabs OR unique car names if query=distinctCars)
export async function GET(req, context) {
  try {
    const { serviceType } = await context.params;
    const client = await dbConnect();
    const db = client.connection.db;

    let collectionName;
    switch (serviceType) {
      case "cars":
        collectionName = "carrs";
        break;
      case "roundtrips":
        collectionName = "roundtrips";
        break;
      case "hourly":
        collectionName = "hourlytrips";
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid service type" }), { status: 400 });
    }

    const url = new URL(req.url);
    const distinctCars = url.searchParams.get("distinctCars");

    if (distinctCars === "true") {
      // ✅ सिर्फ unique Car names दो (dropdown के लिए)
      const uniqueCars = await db.collection(collectionName).distinct("Car");
      return new Response(JSON.stringify({ success: true, cars: uniqueCars }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Fetch all cabs including old ones missing Type/Subtype
    const cabs = await db.collection(collectionName)
      .find({
        $or: [
          { Type: { $exists: false } }, // old documents
          { Type: { $exists: true } }   // new documents
        ]
      })
      .toArray();

    return new Response(JSON.stringify({ success: true, data: cabs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error fetching cabs:", err);
    return new Response(JSON.stringify({ success: false, error: "Failed to fetch cabs" }), { status: 500 });
  }
}

// ✅ POST (Add new cab)
export async function POST(req, context) {
  try {
    const { serviceType } = await context.params;
    const body = await req.json();
    const client = await dbConnect();
    const db = client.connection.db;

    let collectionName;
    switch (serviceType) {
      case "cars":
        collectionName = "carrs";
        break;
      case "roundtrips":
        collectionName = "roundtrips";
        break;
      case "hourly":
        collectionName = "hourlytrips";
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid service type" }), { status: 400 });
    }

    const result = await db.collection(collectionName).insertOne(body);

    return new Response(JSON.stringify({ success: true, insertedId: result.insertedId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error adding cab:", err);
    return new Response(JSON.stringify({ success: false, error: "Failed to add cab" }), { status: 500 });
  }
}

// ✅ PUT (Update cab)
export async function PUT(req, context) {
  try {
    const { serviceType } = await context.params;
    const body = await req.json();
    const client = await dbConnect();
    const db = client.connection.db;

    let collectionName;
    switch (serviceType) {
      case "cars":
        collectionName = "carrs";
        break;
      case "roundtrips":
        collectionName = "roundtrips";
        break;
      case "hourly":
        collectionName = "hourlytrips";
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid service type" }), { status: 400 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id || body._id) {
      const updateId = id || body._id;
      const { _id, ...updateData } = body;
      const result = await db.collection(collectionName).updateOne(
        { _id: new ObjectId(updateId) },
        { $set: updateData }
      );
      return new Response(JSON.stringify({ success: true, modifiedCount: result.modifiedCount }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid update data" }), { status: 400 });

  } catch (err) {
    console.error("Error updating cab:", err);
    return new Response(JSON.stringify({ success: false, error: "Failed to update cab" }), { status: 500 });
  }
}

// ✅ DELETE (remove cab by id)
export async function DELETE(req, context) {
  try {
    const { serviceType } = await context.params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing cab id" }), { status: 400 });
    }

    const client = await dbConnect();
    const db = client.connection.db;

    let collectionName;
    switch (serviceType) {
      case "cars":
        collectionName = "carrs";
        break;
      case "roundtrips":
        collectionName = "roundtrips";
        break;
      case "hourly":
        collectionName = "hourlytrips";
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid service type" }), { status: 400 });
    }

    const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ success: true, deletedCount: result.deletedCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error deleting cab:", err);
    return new Response(JSON.stringify({ success: false, error: "Failed to delete cab" }), { status: 500 });
  }
}
