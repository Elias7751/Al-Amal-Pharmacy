const User = require('../models/User');
const Order = require('../models/Order');
const Prescription = require('../models/Prescription');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

class AnalyticsService {
  /**
   * Get overall dashboard statistics
   */
  static async getDashboardStats() {
    const totalUsers = await User.count({ where: { role: 'user' } });
    
    const totalOrders = await Order.count();
    
    // Calculate total revenue, excluding cancelled orders
    const totalRevenueResult = await Order.sum('totalAmount', {
      where: {
        status: { [Op.ne]: 'Cancelled' }
      }
    });
    
    const totalPrescriptions = await Prescription.count();

    // Sales Trend (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesTrend = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'sales']
      ],
      where: {
        status: { [Op.ne]: 'Cancelled' },
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    return {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenueResult || 0,
      totalPrescriptions,
      salesTrend
    };
  }
}

module.exports = AnalyticsService;
