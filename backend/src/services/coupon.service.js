const Coupon = require('../models/Coupon');
const { Op } = require('sequelize');

class CouponService {
  /**
   * Create a new coupon (Admin)
   */
  static async createCoupon(data) {
    const existing = await Coupon.findOne({ where: { code: data.code } });
    if (existing) {
      throw new Error('Coupon code already exists');
    }
    return await Coupon.create(data);
  }

  /**
   * Get all coupons (Admin)
   */
  static async getAllCoupons() {
    return await Coupon.findAll({ order: [['createdAt', 'DESC']] });
  }

  /**
   * Validate a coupon code and return its discount percentage
   */
  static async validateCoupon(code) {
    const coupon = await Coupon.findOne({ where: { code } });
    
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }
    
    if (!coupon.isActive) {
      throw new Error('This coupon is no longer active');
    }
    
    if (new Date() > new Date(coupon.expirationDate)) {
      throw new Error('This coupon has expired');
    }
    
    return coupon;
  }
}

module.exports = CouponService;
