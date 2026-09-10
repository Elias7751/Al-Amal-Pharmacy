const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Public or User route
// Anyone (or at least logged in users) can validate a coupon
router.get('/validate/:code', protect, couponController.validateCoupon);

// Admin routes
router.post('/', protect, authorize('admin'), couponController.createCoupon);
router.get('/', protect, authorize('admin'), couponController.getAllCoupons);

module.exports = router;
