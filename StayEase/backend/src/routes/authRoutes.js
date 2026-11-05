const router = require('express').Router();
const controller = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/me', auth, controller.me);
router.put('/change-password', auth, controller.changePassword);
router.patch('/profile', auth, controller.updateProfile);
module.exports = router;
