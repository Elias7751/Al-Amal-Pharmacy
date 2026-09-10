const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', orderController.checkout);
router.get('/my-orders', orderController.getMyOrders);
router.get('/my-orders/:id', orderController.getOrderById);

// Admin routes
router.get('/', authorize('admin'), orderController.getAllOrders);
router.put('/:id/status', authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
