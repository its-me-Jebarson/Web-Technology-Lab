const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
exports.listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('name email role isActive createdAt').sort({ createdAt: -1 });
  res.json({ users });
});
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, role, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (user._id.toString() === req.user.id && (role && role !== 'admin' || isActive === false)) return res.status(400).json({ message: 'You cannot remove your own admin access or deactivate your own account.' });
  if (name !== undefined) user.name = String(name).trim();
  if (role !== undefined) { if (!['admin', 'user'].includes(role)) return res.status(400).json({ message: 'Invalid role.' }); user.role = role; }
  if (isActive !== undefined) user.isActive = Boolean(isActive);
  await user.save();
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive }, message: 'User updated.' });
});
