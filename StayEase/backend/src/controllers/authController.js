const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const makeToken = (user) => jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'development_only_change_me', { expiresIn: '1d' });
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role });

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return res.status(400).json({ message: 'Password must be at least 8 characters and include a letter and a number.' });
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12), role: 'user' });
  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
  res.json({ token: makeToken(user), user: publicUser(user) });
});

exports.me = asyncHandler(async (req, res) => res.json({ user: req.user }));
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Account not found.' });
  if (name !== undefined) { if (!String(name).trim()) return res.status(400).json({ message: 'Name cannot be empty.' }); user.name = String(name).trim().slice(0, 80); }
  if (phone !== undefined) { const value = String(phone).trim(); if (value && !/^[+0-9()\-\s]{7,20}$/.test(value)) return res.status(400).json({ message: 'Enter a valid phone number.' }); user.phone = value; }
  await user.save();
  res.json({ user: publicUser(user), message: 'Profile updated successfully.' });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required.' });
  if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) return res.status(400).json({ message: 'New password must be at least 8 characters and include a letter and a number.' });
  const user = await User.findById(req.user.id).select('+password');
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) return res.status(400).json({ message: 'Current password is incorrect.' });
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ message: 'Password changed successfully. Please log in again.' });
});
