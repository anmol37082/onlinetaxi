import dbConnect from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await dbConnect();
    const db = client.db("Onlinetaxi");
    const collection = db.collection("hourlytrips");

    const cities = await collection
      .find({})
      .project({ City: 1, _id: 0 })
      .toArray();

    const uniqueCities = Array.from(new Set(cities.map((c) => c.City)));

    return new Response(JSON.stringify({ cities: uniqueCities }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch cities" }), { status: 500 });
  }
}
