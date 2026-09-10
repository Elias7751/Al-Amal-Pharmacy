const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');

class ReviewService {
  /**
   * Add a review for a product
   */
  static async addReview(userId, productId, rating, comment) {
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) throw new Error('Product not found');

    // Check if the user already reviewed this product
    const existingReview = await Review.findOne({
      where: { userId, productId }
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    return await Review.create({
      userId,
      productId,
      rating,
      comment
    });
  }

  /**
   * Get all reviews for a product
   */
  static async getProductReviews(productId) {
    return await Review.findAll({
      where: { productId },
      include: [{ model: User, as: 'user', attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Delete a review
   */
  static async deleteReview(reviewId, userId, userRole) {
    const review = await Review.findByPk(reviewId);
    if (!review) throw new Error('Review not found');

    // Check ownership or admin status
    if (review.userId !== userId && userRole !== 'admin') {
      throw new Error('Not authorized to delete this review');
    }

    await review.destroy();
    return { message: 'Review deleted successfully' };
  }
}

module.exports = ReviewService;
