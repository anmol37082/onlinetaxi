import mongoose from "mongoose";

const TourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    tag: { type: String, required: true },
    duration: String,
    price: String,
    rating: Number,
    slug: { type: String, unique: true },
    days: [
      {
        dayTitle: { type: String, required: true },
        morning: { type: String },
        afternoon: { type: String },
        evening: { type: String },
        night: { type: String },
      }
    ],
    summaryTitle: { type: String, default: "Summary of the Itinerary" },
    summaryText: { type: String },
    travelTipsTitle: { type: String, default: "Travel Tips" },
    travelTips: [{ type: String }], // Dynamic array
    closingParagraph: { type: String },
  },
  { timestamps: true }
);

const Tour = mongoose.models.Tour || mongoose.model("Tour", TourSchema);
export default Tour;
