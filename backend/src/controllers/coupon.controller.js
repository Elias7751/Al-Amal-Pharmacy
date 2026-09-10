const CouponService = require('../services/coupon.service');
const ApiResponse = require('../utils/apiResponse');

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await CouponService.createCoupon(req.body);
    return ApiResponse.success(res, 'Coupon created successfully', coupon, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponService.getAllCoupons();
    return ApiResponse.success(res, 'Coupons retrieved successfully', coupons);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const coupon = await CouponService.validateCoupon(req.params.code);
    return ApiResponse.success(res, 'Coupon is valid', {
      code: coupon.code,
      discountPercentage: coupon.discountPercentage
    });
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};
