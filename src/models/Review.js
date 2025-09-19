import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String, required: false, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    tourType: { type: String, required: true },
    tourDescription: { type: String, required: true },
    tourImage: { type: String, default: "" },
    gradientColor: { type: String, default: "linear-gradient(135deg, #10b981, #059669)" },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
