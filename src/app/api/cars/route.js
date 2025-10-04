import { ObjectId } from "mongodb";
import dbConnect from "@/lib/mongodb";

// ===================== GET (Fetch Unique Car Names) =====================
export async function GET() {
  try {
    const client = await dbConnect();
    // Mongoose connection returns connection object, get db from client.connection.db
    const db = client.connection.db;

    // सिर्फ unique car names निकालना
    const uniqueCars = await db.collection("carrs").distinct("Car");

    return new Response(JSON.stringify({
      success: true,
      cars: uniqueCars
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error fetching car names:", err);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch car names"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ===================== POST (Search Cabs by From/To) =====================
export async function POST(req) {
  try {
    const body = await req.json();
    const { from, to } = body;

    if (!from || !to) {
      return new Response(JSON.stringify({
        error: "Missing required fields: 'from' and 'to'"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await dbConnect();
    // Mongoose connection returns connection object, get db from client.connection.db
    const db = client.connection.db;

    const cabs = await db.collection("carrs")
      .find({ From: from, To: to })
      .limit(100)
      .toArray();

    return new Response(JSON.stringify(cabs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error in POST /api/cars:", err);
    return new Response(JSON.stringify({
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ===================== PUT (Update Image by Car Type or ID) =====================
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, car, imgg, ...updateData } = body;

    const client = await dbConnect();
    // Mongoose connection returns connection object, get db from client.connection.db
    const db = client.connection.db;

    if (id) {
      // Update by ID
      const result = await db.collection("carrs").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return new Response(JSON.stringify({ error: "Cab not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: "Cab updated successfully"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } else if (car && imgg !== undefined) {
      // Bulk update by Car name
      const collections = ["carrs", "roundtrips", "hourlytrips"];
      let totalModified = 0;

      for (const collectionName of collections) {
        const result = await db.collection(collectionName).updateMany(
          { Car: car },
          { $set: { Imgg: imgg } }  // Fixed field name casing to match BookingSection usage
        );
        totalModified += result.modifiedCount;
      }

      return new Response(JSON.stringify({
        success: true,
        message: `Image updated for ${totalModified} cabs with car type '${car}'`
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } else {
      return new Response(JSON.stringify({
        error: "Either 'id' or ('car' + 'imgg') required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (err) {
    console.error("Error updating cab:", err);
    return new Response(JSON.stringify({
      error: "Failed to update cab"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ===================== DELETE (Delete Cab by ID) =====================
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Cab ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await dbConnect();
    const db = client.db("Onlinetaxi");

    const result = await db.collection("carrs").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Cab not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Cab deleted successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error deleting cab:", err);
    return new Response(JSON.stringify({ error: "Failed to delete cab" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
