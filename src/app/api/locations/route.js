// app/api/locations/route.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    await client.connect();
    const db = client.db("Onlinetaxi");
    const collection = db.collection("carrs");

    // Get all From and To locations
    const locations = await collection
      .find({})
      .project({ From: 1, To: 1, _id: 0 })
      .toArray();

    // Make unique lists for From
    const fromLocations = Array.from(new Set(locations.map((l) => l.From)));

    // Group To by From
    const toByFrom = {};
    locations.forEach((l) => {
      if (!toByFrom[l.From]) toByFrom[l.From] = new Set();
      toByFrom[l.From].add(l.To);
    });
    // Convert sets to arrays
    Object.keys(toByFrom).forEach((from) => {
      toByFrom[from] = Array.from(toByFrom[from]);
    });

    return new Response(JSON.stringify({ from: fromLocations, toByFrom }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch locations" }), { status: 500 });
  }
}
