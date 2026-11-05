const Room = require('../models/Room');
const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');

exports.listRooms = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.type) filter.roomType = new RegExp(`^${req.query.type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  if (req.query.maxPrice && Number.isFinite(Number(req.query.maxPrice))) filter.pricePerNight = { $lte: Number(req.query.maxPrice) };
  if (req.query.guests && Number.isFinite(Number(req.query.guests))) filter.capacity = { $gte: Number(req.query.guests) };
  let rooms = await Room.find(filter).sort({ pricePerNight: 1 });
  const hasValidDates = req.query.checkIn && req.query.checkOut &&
    !Number.isNaN(new Date(req.query.checkIn).getTime()) &&
    !Number.isNaN(new Date(req.query.checkOut).getTime()) &&
    new Date(req.query.checkIn) < new Date(req.query.checkOut);
  if (hasValidDates) {
    const start = new Date(req.query.checkIn); const end = new Date(req.query.checkOut);
    const conflicts = await Booking.find({ status: { $in: ['pending', 'confirmed'] }, checkIn: { $lt: end }, checkOut: { $gt: start } }).distinct('room');
    rooms = rooms.map((room) => ({ ...room.toObject(), isAvailableForDates: !conflicts.some((id) => id.equals(room._id)) }));
  } else {
    rooms = rooms.map((room) => ({ ...room.toObject(), isAvailableForDates: true }));
  }
  res.json({ rooms });
});
exports.getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ _id: req.params.id, isActive: true });
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  res.json({ room });
});
exports.createRoom = asyncHandler(async (req, res) => {
  const { roomNumber, roomType, pricePerNight, capacity } = req.body;
  if (!roomNumber?.trim() || !roomType?.trim() || Number(pricePerNight) <= 0 || Number(capacity) < 1) return res.status(400).json({ message: 'Room number, type, positive price and capacity are required.' });
  const room = await Room.create({ ...req.body, roomNumber: roomNumber.trim(), roomType: roomType.trim(), pricePerNight: Number(pricePerNight), capacity: Number(capacity), amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [] });
  res.status(201).json({ room, message: 'Room added successfully.' });
});
exports.updateRoom = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.pricePerNight !== undefined) data.pricePerNight = Number(data.pricePerNight);
  if (data.capacity !== undefined) data.capacity = Number(data.capacity);
  if (data.amenities && !Array.isArray(data.amenities)) data.amenities = String(data.amenities).split(',').map((x) => x.trim()).filter(Boolean);
  const room = await Room.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  res.json({ room, message: 'Room updated successfully.' });
});
exports.deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  const hasHistory = await Booking.exists({ room: room._id });
  if (hasHistory) { room.isActive = false; await room.save(); return res.json({ message: 'Room deactivated because it has booking history.' }); }
  await room.deleteOne();
  res.json({ message: 'Room deleted successfully.' });
});
exports.adminListRooms = asyncHandler(async (_req, res) => res.json({ rooms: await Room.find().sort({ createdAt: -1 }) }));
