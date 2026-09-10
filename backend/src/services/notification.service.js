const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Create a notification for a user
   */
  static async createNotification(userId, title, message) {
    return await Notification.create({ userId, title, message });
  }

  /**
   * Get all notifications for a specific user
   */
  static async getUserNotifications(userId) {
    return await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Mark a specific notification as read
   */
  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) throw new Error('Notification not found');

    notification.isRead = true;
    return await notification.save();
  }

  /**
   * Admin: Send global notification to all users
   */
  static async sendGlobalNotification(title, message) {
    const User = require('../models/User'); // require here to avoid circular dependencies if any
    const users = await User.findAll({ where: { role: 'user' } });
    
    const notifications = users.map(user => ({
      userId: user.id,
      title,
      message
    }));

    return await Notification.bulkCreate(notifications);
  }
}

module.exports = NotificationService;
