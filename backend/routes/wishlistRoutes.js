const express = require('express');
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, addToWishlist);
router.delete('/:productId', verifyToken, removeFromWishlist);
router.get('/', verifyToken, getWishlist);

module.exports = router;
