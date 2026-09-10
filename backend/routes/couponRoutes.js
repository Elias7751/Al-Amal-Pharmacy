const express = require('express');
const router = express.Router();
const { createCoupon, validateCoupon, getCoupons, deleteCoupon } = require('../controllers/couponController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Admin routes
router.post('/', verifyToken, verifyAdmin, createCoupon);
router.get('/', verifyToken, verifyAdmin, getCoupons);
router.delete('/:id', verifyToken, verifyAdmin, deleteCoupon);

// Public/User route to validate a coupon
router.post('/validate', validateCoupon);

module.exports = router;
