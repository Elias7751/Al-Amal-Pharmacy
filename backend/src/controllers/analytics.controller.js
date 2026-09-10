const AnalyticsService = require('../services/analytics.service');
const ApiResponse = require('../utils/apiResponse');

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await AnalyticsService.getDashboardStats();
    return ApiResponse.success(res, 'Dashboard stats retrieved successfully', stats);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
