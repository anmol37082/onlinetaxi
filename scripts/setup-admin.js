const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
require('dotenv').config();

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onlinetaxi');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ adminId: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const admin = new Admin({
      adminId: 'admin',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Default admin user created successfully!');
    console.log('📧 Admin ID: admin');
    console.log('🔑 Password: admin123');
    console.log('🌐 Login URL: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

setupAdmin();
