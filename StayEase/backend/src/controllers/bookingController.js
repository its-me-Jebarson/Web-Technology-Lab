const Booking = require('../models/Booking');
const Room = require('../models/Room');
const asyncHandler = require('../utils/asyncHandler');
const validDate = (value) => value && !Number.isNaN(new Date(value).getTime());

exports.createBooking = asyncHandler(async (req, res) => {
  const { roomId, checkIn, checkOut, guests } = req.body;
  if (!roomId || !validDate(checkIn) || !validDate(checkOut)) return res.status(400).json({ message: 'Room, check-in and check-out dates are required.' });
  const start = new Date(checkIn); const end = new Date(checkOut); const guestCount = Number(guests);
  if (start >= end) return res.status(400).json({ message: 'Check-out must be after check-in.' });
  if (start < new Date(new Date().setHours(0, 0, 0, 0))) return res.status(400).json({ message: 'Check-in cannot be in the past.' });
  if (!Number.isInteger(guestCount) || guestCount < 1) return res.status(400).json({ message: 'Enter a valid number of guests.' });
  const room = await Room.findOne({ _id: roomId, isActive: true });
  if (!room || room.maintenanceStatus === 'maintenance') return res.status(404).json({ message: 'This room is no longer available or is under maintenance.' });
  if (guestCount > room.capacity) return res.status(400).json({ message: `This room can accommodate up to ${room.capacity} guests.` });
  const conflict = await Booking.exists({ room: room._id, status: { $in: ['pending', 'confirmed'] }, checkIn: { $lt: end }, checkOut: { $gt: start } });
  if (conflict) return res.status(409).json({ message: 'This room is already booked for some or all of those dates. Please choose another room or dates.' });
  const nights = Math.ceil((end - start) / 86400000);
  const booking = await Booking.create({ user: req.user.id, room: room._id, checkIn: start, checkOut: end, guests: guestCount, totalPrice: nights * room.pricePerNight, status: 'confirmed', paymentStatus: 'pending' });
  await booking.populate([{ path: 'room' }, { path: 'user', select: 'name email' }]);
  res.status(201).json({ booking, message: 'Booking confirmed. Payment is pending until the receptionist records it.' });
});
exports.myBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('room').sort({ createdAt: -1 });
  res.json({ bookings });
});
exports.allBookings = asyncHandler(async (_req, res) => {
  const bookings = await Booking.find().populate('room').populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ bookings });
});
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) return res.status(403).json({ message: 'You cannot cancel another user’s booking.' });
  if (!['pending', 'confirmed'].includes(booking.status)) return res.status(400).json({ message: 'This booking can no longer be cancelled.' });
  booking.status = 'cancelled'; await booking.save();
  res.json({ booking, message: 'Booking cancelled.' });
});
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid booking status.' });
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  if (status === 'confirmed') {
    const conflict = await Booking.exists({ _id: { $ne: booking._id }, room: booking.room, status: { $in: ['pending', 'confirmed'] }, checkIn: { $lt: booking.checkOut }, checkOut: { $gt: booking.checkIn } });
    if (conflict) return res.status(409).json({ message: 'Cannot confirm: another pending or confirmed booking overlaps these dates.' });
  }
  booking.status = status; await booking.save();
  await booking.populate([{ path: 'room' }, { path: 'user', select: 'name email' }]);
  res.json({ booking, message: 'Booking status updated.' });
});
exports.dashboard = asyncHandler(async (_req, res) => {
  const [rooms, activeRooms, users, bookings, pending, confirmed] = await Promise.all([
    Room.countDocuments(), Room.countDocuments({ isActive: true }),
    require('../models/User').countDocuments({ role: 'user', isActive: true }), Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }), Booking.countDocuments({ status: 'confirmed' })
  ]);
  res.json({ stats: { rooms, activeRooms, users, bookings, pending, confirmed } });
});
