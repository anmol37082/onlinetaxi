import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  // User Information (auto-filled from Profile)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  userAddress: { type: String },

  // Route/Tour/Cab Information
  bookingType: { type: String, enum: ['route', 'tour', 'cab'], required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TopRoute' },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  title: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },

  // Booking Details
  travelDate: { type: Date, required: true },
  time: { type: String },
  specialRequests: { type: String },

  // Additional Details
  pickupLocation: { type: String },
  dropLocation: { type: String },
  tripType: { type: String, enum: ['oneway', 'roundtrip', 'hourly'] },

  // Status and Tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookingReference: {
    type: String,
    unique: true,
    default: function() {
      return 'BK' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
    }
  },

  // Admin Notes
  adminNotes: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
  completedAt: { type: Date },
  cancelledAt: { type: Date }
});

// Update the updatedAt field before saving
BookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for better query performance
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ travelDate: 1 });

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export default Booking;
