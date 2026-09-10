const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Protected routes (User)
router.get('/', protect, notificationController.getMyNotifications);
router.put('/:id/read', protect, notificationController.markAsRead);

// Admin routes
router.post('/global', protect, authorize('admin'), notificationController.sendGlobalNotification);

module.exports = router;
