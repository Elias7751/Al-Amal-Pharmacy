const ReviewService = require('../services/review.service');
const ApiResponse = require('../utils/apiResponse');

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = await ReviewService.addReview(req.user.id, productId, rating, comment);
    return ApiResponse.success(res, 'Review added successfully', review, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await ReviewService.getProductReviews(req.params.productId);
    return ApiResponse.success(res, 'Reviews retrieved successfully', reviews);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const response = await ReviewService.deleteReview(req.params.id, req.user.id, req.user.role);
    return ApiResponse.success(res, response.message);
  } catch (error) {
    return ApiResponse.error(res, error.message, 403);
  }
};
