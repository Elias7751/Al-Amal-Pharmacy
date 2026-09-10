const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route: Get all reviews for a specific product
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes: Require authentication
router.post('/', protect, reviewController.addReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
