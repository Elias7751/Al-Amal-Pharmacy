const express = require('express');
const router = express.Router();
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Add a new review (must be logged in)
router.post('/', verifyToken, addReview);

// Get reviews for a specific product
router.get('/product/:productId', getProductReviews);

module.exports = router;
