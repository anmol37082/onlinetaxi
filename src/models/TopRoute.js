import mongoose from "mongoose";

const TopRouteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    imageAlt: { type: String, required: true },
    distance: { type: String, required: true },
    duration: { type: String, required: true },
    carType: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String, required: true }],
    fromCity: { type: String, default: "" },
    toCity: { type: String, default: "" },
    introHeading: { type: String, default: "" },
    introParagraph: { type: String, default: "" },
    overviewHeading: { type: String, default: "" },
    overviewParagraph: { type: String, default: "" },
    aboutHeading: { type: String, default: "" },
    aboutParagraph: { type: String, default: "" },
    journeyHeading: { type: String, default: "" },
    journeyParagraph: { type: String, default: "" },
    destinationHeading: { type: String, default: "" },
    destinationParagraph: { type: String, default: "" },
    sightseeing: [{ type: String }],
    whyHeading: { type: String, default: "" },
    whyPoints: [{ type: String }],
    discoverHeading: { type: String, default: "" },
    discoverParagraph: { type: String, default: "" },
    attractions: [{ type: String }],
    bookingHeading: { type: String, default: "" },
    bookingParagraph: { type: String, default: "" },
  },
  { timestamps: true }
);

const TopRoute = mongoose.models.TopRoute || mongoose.model("TopRoute", TopRouteSchema);
export default TopRoute;
