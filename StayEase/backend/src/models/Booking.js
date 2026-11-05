const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  bookingRef: { type: String, unique: true, sparse: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  amountPaid: { type: Number, default: 0, min: 0 },
  paymentStatus: { type: String, enum: ['pending', 'partially_paid', 'paid', 'refunded'], default: 'pending' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' }
}, { timestamps: true });
bookingSchema.pre('validate', function(next) {
  if (!this.bookingRef) this.bookingRef = `STY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  next();
});
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });
module.exports = mongoose.model('Booking', bookingSchema);
