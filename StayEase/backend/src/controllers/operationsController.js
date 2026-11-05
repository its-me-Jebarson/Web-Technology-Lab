const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const Payment = require('../models/Payment');
const MaintenanceIssue = require('../models/MaintenanceIssue');
const asyncHandler = require('../utils/asyncHandler');

exports.listPayments = asyncHandler(async (_req, res) => {
  const payments = await Payment.find().populate({ path: 'booking', populate: [{ path: 'user', select: 'name email' }, { path: 'room', select: 'roomNumber roomType' }] }).sort({ createdAt: -1 });
  res.json({ payments });
});
exports.createPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, method = 'cash', status = 'paid', reference = '', note = '' } = req.body;
  const value = Number(amount);
  if (!bookingId || !Number.isFinite(value) || value <= 0) return res.status(400).json({ message: 'Choose a booking and enter a payment amount greater than zero.' });
  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  if (booking.status === 'cancelled' || booking.paymentStatus === 'paid' || booking.paymentStatus === 'refunded' || Number(booking.totalPrice) <= Number(booking.amountPaid || 0)) return res.status(400).json({ message: 'This booking has no outstanding payment.' });
  if (value > Number(booking.totalPrice) - Number(booking.amountPaid || 0)) return res.status(400).json({ message: 'Payment amount cannot exceed the outstanding balance.' });
  const payment = await Payment.create({ booking: booking._id, amount: value, method, status, reference, note, recordedBy: req.user.id });
  const payments = await Payment.find({ booking: booking._id });
  const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const refunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);
  booking.paymentStatus = refunded >= paid && refunded > 0 ? 'refunded' : paid - refunded <= 0 ? 'pending' : paid - refunded >= booking.totalPrice ? 'paid' : 'partially_paid';
  booking.amountPaid = Math.max(0, paid - refunded);
  await booking.save();
  res.status(201).json({ payment, message: 'Payment recorded and booking balance updated.' });
});
exports.listMaintenance = asyncHandler(async (_req, res) => res.json({ issues: await MaintenanceIssue.find().populate('room', 'roomNumber roomType').sort({ createdAt: -1 }) }));
exports.createMaintenance = asyncHandler(async (req, res) => {
  const { roomId, title, description = '', priority = 'medium' } = req.body;
  if (!roomId || !title?.trim()) return res.status(400).json({ message: 'Room and issue title are required.' });
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  const issue = await MaintenanceIssue.create({ room: roomId, title, description, priority, reportedBy: req.user.id });
  room.isActive = false; room.maintenanceStatus = 'maintenance'; await room.save();
  await issue.populate('room', 'roomNumber roomType');
  res.status(201).json({ issue, message: 'Maintenance issue reported. The room is blocked from new bookings.' });
});
exports.updateMaintenance = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['open', 'in_progress', 'resolved'].includes(status)) return res.status(400).json({ message: 'Invalid maintenance status.' });
  const issue = await MaintenanceIssue.findById(req.params.id).populate('room');
  if (!issue) return res.status(404).json({ message: 'Maintenance issue not found.' });
  issue.status = status; issue.resolvedAt = status === 'resolved' ? new Date() : null; await issue.save();
  if (status === 'resolved' && issue.room && !(await MaintenanceIssue.exists({ _id: { $ne: issue._id }, room: issue.room._id, status: { $ne: 'resolved' } }))) {
    issue.room.maintenanceStatus = 'ready'; issue.room.isActive = true; await issue.room.save();
  }
  await issue.populate('room', 'roomNumber roomType');
  res.json({ issue, message: status === 'resolved' ? 'Issue resolved. Room marked ready if no other open issues remain.' : 'Maintenance status updated.' });
});
exports.dashboard = asyncHandler(async (_req, res) => {
  const now = new Date(); const startDay = new Date(now); startDay.setHours(0,0,0,0); const tomorrow = new Date(startDay); tomorrow.setDate(tomorrow.getDate()+1);
  const week = new Date(startDay); week.setDate(week.getDate()-6); const month = new Date(now.getFullYear(),now.getMonth(),1); const year = new Date(now.getFullYear(),0,1);
  const [rooms, activeRooms, maintenanceRooms, occupiedRooms, users, bookings, pending, confirmed, checkIns, checkOuts, payments, openIssues, popularRooms] = await Promise.all([
    Room.countDocuments(), Room.countDocuments({ isActive: true }), Room.countDocuments({ maintenanceStatus: 'maintenance' }), Booking.distinct('room', { status: 'confirmed', checkIn: { $lt: tomorrow }, checkOut: { $gt: startDay } }).then(ids => ids.length), User.countDocuments({ role: 'user', isActive: true }), Booking.countDocuments(), Booking.countDocuments({ status: 'pending' }), Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ status: { $in: ['confirmed','pending'] }, checkIn: { $gte: startDay, $lt: tomorrow } }), Booking.countDocuments({ status: { $in: ['confirmed','pending'] }, checkOut: { $gte: startDay, $lt: tomorrow } }), Payment.find({ status: 'paid' }).select('amount createdAt'), MaintenanceIssue.countDocuments({ status: { $ne: 'resolved' } }), Booking.aggregate([{ $match: { status: { $in: ['confirmed','completed'] } } }, { $group: { _id: '$room', bookings: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } }, { $sort: { bookings: -1 } }, { $limit: 5 }, { $lookup: { from: 'rooms', localField: '_id', foreignField: '_id', as: 'room' } }, { $unwind: { path: '$room', preserveNullAndEmptyArrays: true } }, { $project: { bookings: 1, revenue: 1, roomNumber: '$room.roomNumber', roomType: '$room.roomType' } }])
  ]);
  const revenueSince = (date) => payments.filter(p => p.createdAt >= date).reduce((s,p)=>s+p.amount,0);
  const revenue = { today: revenueSince(startDay), week: revenueSince(week), month: revenueSince(month), year: revenueSince(year), allTime: payments.reduce((s,p)=>s+p.amount,0) };
  res.json({ stats: { rooms, activeRooms, maintenanceRooms, occupiedRooms, users, bookings, pending, confirmed, checkIns, checkOuts, openIssues, revenue }, popularRooms });
});
exports.exportCsv = asyncHandler(async (req, res) => {
  const type = String(req.query.type || 'bookings');
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  let header, rows;
  if (type === 'payments') {
    const docs = await Payment.find().populate({ path: 'booking', populate: [{path:'user',select:'name email'},{path:'room',select:'roomNumber roomType'}] }).sort({createdAt:-1});
    header=['Date','Guest','Email','Room','Booking total','Payment amount','Method','Status','Reference']; rows=docs.map(p=>[p.createdAt.toISOString(),p.booking?.user?.name,p.booking?.user?.email,p.booking?.room?.roomNumber,p.booking?.totalPrice,p.amount,p.method,p.status,p.reference]);
  } else if (type === 'revenue') {
    const docs = await Payment.find({status:'paid'}).sort({createdAt:-1}); header=['Date','Amount','Method','Status','Reference']; rows=docs.map(p=>[p.createdAt.toISOString(),p.amount,p.method,p.status,p.reference]);
  } else {
    const docs = await Booking.find().populate('user','name email').populate('room','roomNumber roomType').sort({createdAt:-1}); header=['Booking Reference','Guest','Email','Room','Room type','Check-in','Check-out','Guests','Total','Status','Payment status']; rows=docs.map(b=>[b.bookingRef || `STY-${String(b._id).slice(-6).toUpperCase()}`,b.user?.name,b.user?.email,b.room?.roomNumber,b.room?.roomType,b.checkIn?.toISOString(),b.checkOut?.toISOString(),b.guests,b.totalPrice,b.status,b.paymentStatus]);
  }
  res.setHeader('Content-Type','text/csv; charset=utf-8'); res.setHeader('Content-Disposition',`attachment; filename="stayease-${type}-report.csv"`); res.send([header,...rows].map(r=>r.map(esc).join(',')).join('\r\n'));
});
