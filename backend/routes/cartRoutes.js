const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, addToCart);
router.get('/', verifyToken, getCart);
router.delete('/:productId', verifyToken, removeFromCart);
router.delete('/', verifyToken, clearCart);

module.exports = router;
