import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Update lastLogin when user logs in
UserSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
