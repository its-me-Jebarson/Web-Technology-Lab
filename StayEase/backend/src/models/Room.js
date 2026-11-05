const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, trim: true, unique: true },
  roomType: { type: String, required: true, trim: true, enum: ['Standard', 'Deluxe', 'Suite', 'Family', 'Presidential'] },
  description: { type: String, default: '', maxlength: 1000 },
  pricePerNight: { type: Number, required: true, min: 1 },
  capacity: { type: Number, required: true, min: 1, max: 20, default: 2 },
  amenities: [{ type: String, trim: true }],
  image: { type: String, default: '' },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
  maintenanceStatus: { type: String, enum: ['ready', 'maintenance'], default: 'ready' },
  housekeepingStatus: { type: String, enum: ['ready', 'dirty', 'cleaning'], default: 'ready' }
}, { timestamps: true });
module.exports = mongoose.model('Room', roomSchema);
