import dbConnect from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { city, hours } = await req.json(); // user input
    const client = await dbConnect();
    const db = client.connection.db;

    const cars = await db
      .collection("hourlytrips")
      .find({ City: city, Hours: hours })
      .toArray();

    return new Response(JSON.stringify(cars), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
