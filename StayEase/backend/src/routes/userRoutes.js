const router = require('express').Router();
const c = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
router.get('/', auth, admin, c.listUsers);
router.patch('/:id', auth, admin, c.updateUser);
module.exports = router;
