import mongoose from 'mongoose';

const LoginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['login', 'logout'],
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Unknown'
  },
  deviceInfo: {
    type: String,
    default: 'Unknown'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionDuration: {
    type: Number, // in minutes
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
LoginHistorySchema.index({ userId: 1, timestamp: -1 });
LoginHistorySchema.index({ email: 1, timestamp: -1 });

export default mongoose.models.LoginHistory || mongoose.model('LoginHistory', LoginHistorySchema);
