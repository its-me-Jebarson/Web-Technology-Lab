const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const controller = require('../controllers/reviewController');
router.post('/', auth, controller.createReview);
router.get('/', auth, admin, controller.listReviews);
module.exports = router;
