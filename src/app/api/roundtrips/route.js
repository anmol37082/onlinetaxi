import dbConnect from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { from, to } = await req.json(); // user input
    const client = await dbConnect();
    const db = client.connection.db;

    const cabs = await db
      .collection("roundtrips")
      .find({ From: from, To: to })
      .toArray();

    return new Response(JSON.stringify(cabs), {
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
