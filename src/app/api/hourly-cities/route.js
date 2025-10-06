import dbConnect from "@/lib/mongodb";
import HourlyTrip from "@/models/HourlyTrip";

export async function GET(req) {
  try {
    await dbConnect();

    const cities = await HourlyTrip.distinct("City");

    return new Response(JSON.stringify({ cities }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch cities" }), { status: 500 });
  }
}
