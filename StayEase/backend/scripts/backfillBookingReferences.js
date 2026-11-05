require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../src/models/Booking');
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const bookings = await Booking.find({ $or: [{ bookingRef: { $exists: false } }, { bookingRef: '' }, { bookingRef: null }] }).select('_id createdAt').lean();
    let updated = 0;
    for (const booking of bookings) {
      const date = new Date(booking.createdAt || Date.now());
      const day = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}`;
      const ref = `STY-${day}-${String(booking._id).slice(-6).toUpperCase()}`;
      await Booking.updateOne({ _id: booking._id, $or: [{ bookingRef: { $exists: false } }, { bookingRef: '' }, { bookingRef: null }] }, { $set: { bookingRef: ref } });
      updated++;
    }
    console.log(`Booking reference backfill complete. Updated ${updated} booking(s).`);
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();
