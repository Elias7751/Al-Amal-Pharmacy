const NotificationService = require('../services/notification.service');
const ApiResponse = require('../utils/apiResponse');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user.id);
    return ApiResponse.success(res, 'Notifications retrieved successfully', notifications);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await NotificationService.markAsRead(req.params.id, req.user.id);
    return ApiResponse.success(res, 'Notification marked as read', notification);
  } catch (error) {
    return ApiResponse.error(res, error.message, 404);
  }
};

// Admin endpoint
exports.sendGlobalNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    await NotificationService.sendGlobalNotification(title, message);
    return ApiResponse.success(res, 'Global notifications sent successfully', null, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};
