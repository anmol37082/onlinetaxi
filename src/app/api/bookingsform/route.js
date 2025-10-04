import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { from, to, date, luggage } = await req.json();
    const client = await clientPromise;
    const db = client.db("taxi"); // database name

    const result = await db.collection("bookings").insertOne({
      from,
      to,
      date,
      luggage,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ success: true, bookingId: result.insertedId }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
