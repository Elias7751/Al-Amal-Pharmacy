const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Only admins can view the dashboard analytics
router.get('/', verifyToken, verifyAdmin, getDashboardStats);

module.exports = router;
