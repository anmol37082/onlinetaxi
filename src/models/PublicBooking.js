import mongoose from "mongoose";

const PublicBookingSchema = new mongoose.Schema({
  service_type: { type: String, required: true, enum: ['outstation', 'local'] },
  trip_type: { type: String, required: true, enum: ['oneway', 'roundtrip', 'hourly', 'airport'] },
  from_location: { type: String },
  to_location: { type: String },
  travel_date: { type: Date, required: true },
  customer_phone: { type: String, required: true },
  customer_email: { type: String },
  package: { type: String },
  from_airport: { type: String },
  to_airport: { type: String },
  city: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookingReference: {
    type: String,
    unique: true,
    default: function() {
      return 'PBK' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PublicBookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const PublicBooking = mongoose.models.PublicBooking || mongoose.model("PublicBooking", PublicBookingSchema);
export default PublicBooking;
