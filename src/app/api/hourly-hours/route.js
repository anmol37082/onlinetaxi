import dbConnect from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await dbConnect();
    const db = client.db("Onlinetaxi");
    const collection = db.collection("hourlytrips");

    const hours = await collection
      .find({})
      .project({ Hours: 1, _id: 0 })
      .toArray();

    const uniqueHours = Array.from(new Set(hours.map((h) => h.Hours)));

    return new Response(JSON.stringify({ hours: uniqueHours }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch hours" }), { status: 500 });
  }
}
