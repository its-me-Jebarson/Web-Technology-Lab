const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  suggestion: { type: String, trim: true, maxlength: 1000, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);
