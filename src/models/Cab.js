import mongoose from "mongoose";

const CabSchema = new mongoose.Schema({
  type: { type: String, enum: ['outstation', 'local'], required: true },
  subtype: { type: String, enum: ['oneway', 'roundtrip', 'hourly', 'airport'], required: true },
  from: { type: String },
  to: { type: String },
  city: { type: String },
  hours: { type: String },
  car: { type: String, required: true }, // Car type string
  imgg: { type: String, required: true }, // Image URL
  price: { type: Number, required: true },
  seats: { type: Number, required: true },
  luggage: { type: Number, required: true },
  incrementPercent: { type: Number, default: 0 }, // For oneway price adjustment
  sbiLag: { type: Number, default: 0 }, // SBI lag
}, { timestamps: true });

const Cab = mongoose.models.Cab || mongoose.model("Cab", CabSchema);
export default Cab;
