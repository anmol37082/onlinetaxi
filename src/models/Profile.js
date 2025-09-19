import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String }, // OTP se aayi email future use ke liye
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
