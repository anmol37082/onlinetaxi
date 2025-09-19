// models/Contact.js
import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  countryCode: { type: String },
  address: { type: String },
  message: { type: String },
}, { timestamps: true });

// Prevent model recompilation in dev (Next.js hot reload)
export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
