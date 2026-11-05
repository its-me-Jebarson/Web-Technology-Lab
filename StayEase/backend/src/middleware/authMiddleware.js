const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development_only_change_me');
    const user = await User.findById(payload.id);
    if (!user || !user.isActive) return res.status(401).json({ message: 'Account not found or deactivated.' });
    req.user = { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone || '', role: user.role };
    next();
  } catch (_err) { return res.status(401).json({ message: 'Your session is invalid or expired. Please log in again.' }); }
};
