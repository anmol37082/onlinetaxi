import dbConnect from "@/lib/mongodb";

// ✅ PUT (Bulk update incrementPercent for all cabs of a service type)
export async function PUT(req, context) {
  try {
    const { serviceType } = await context.params;
    const body = await req.json();
    const { incrementPercent } = body;

    if (typeof incrementPercent !== 'number') {
      return new Response(JSON.stringify({ error: "Invalid incrementPercent value" }), { status: 400 });
    }

    const client = await dbConnect();
    const db = client.db("Onlinetaxi");

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

    // Update all cabs in the collection with the new incrementPercent
    const result = await db.collection(collectionName).updateMany(
      {}, // Update all documents
      { $set: { incrementPercent: incrementPercent } }
    );

    return new Response(JSON.stringify({
      success: true,
      message: `Updated ${result.modifiedCount} cabs with ${incrementPercent}% increment`,
      modifiedCount: result.modifiedCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error updating increment:", err);
    return new Response(JSON.stringify({ success: false, error: "Failed to update increment" }), { status: 500 });
  }
}
