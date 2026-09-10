const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// All analytics routes are strictly for admins
router.use(protect, authorize('admin'));

router.get('/dashboard', analyticsController.getDashboardStats);

module.exports = router;
