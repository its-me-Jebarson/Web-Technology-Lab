const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true, min: 0.01 },
  method: { type: String, enum: ['cash', 'upi', 'online', 'card', 'bank_transfer'], default: 'cash' },
  status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'paid' },
  reference: { type: String, trim: true, default: '' },
  note: { type: String, trim: true, maxlength: 500, default: '' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Payment', paymentSchema);
