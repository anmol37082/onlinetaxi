import mongoose from 'mongoose';

const HourlyTripSchema = new mongoose.Schema({
  City: {
    type: String,
    required: true,
  },
  // Add other fields as needed based on the collection structure
}, {
  collection: 'hourlytrips'
});

const HourlyTrip = mongoose.models.HourlyTrip || mongoose.model('HourlyTrip', HourlyTripSchema);

export default HourlyTrip;
