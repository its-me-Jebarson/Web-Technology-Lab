const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');
exports.createReview = asyncHandler(async (req, res) => {
  const rating = Number(req.body.rating);
  const suggestion = String(req.body.suggestion || '').trim();
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be from 1 to 5.' });
  if (!suggestion) return res.status(400).json({ message: 'Please enter a suggestion.' });
  const review = await Review.create({ user: req.user.id, rating, suggestion });
  res.status(201).json({ message: 'Thank you for your feedback!', review: { rating: review.rating, suggestion: review.suggestion, createdAt: review.createdAt } });
});
exports.listReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find().select('rating suggestion createdAt').sort({ createdAt: -1 }).lean();
  res.json({ reviews });
});
