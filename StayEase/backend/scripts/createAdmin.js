require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotel_booking_db');
    const email = (process.env.ADMIN_EMAIL || 'admin@stayease.local').toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) { console.log(`Admin/user ${email} already exists. No changes made.`); }
    else {
      const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
      const user = await User.create({ name: process.env.ADMIN_NAME || 'StayEase Admin', email, password: await bcrypt.hash(password, 12), role: 'admin' });
      console.log(`Admin created: ${user.email}`);
      console.log('Temporary password is the ADMIN_PASSWORD value in your .env. Change it after first login.');
    }
  } catch (e) { console.error('Could not create admin:', e.message); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();
