const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Middleware to extract user from token without blocking guests
const extractUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            const jwt = require('jsonwebtoken');
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (!err) req.user = decoded;
                next();
            });
            return;
        }
    }
    next();
};

router.post('/', extractUser, createOrder);
router.get('/', extractUser, getOrders);
router.get('/:id', extractUser, getOrderById);
router.put('/:id/status', verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;
