const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ where: { userId, productId } });

    if (existing) {
      // Remove from wishlist
      await existing.destroy();
      return ApiResponse.success(res, null, 'Product removed from wishlist', 200);
    } else {
      // Add to wishlist
      await Wishlist.create({ userId, productId });
      return ApiResponse.success(res, null, 'Product added to wishlist', 201);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name_ar', 'name_en', 'description_ar', 'description_en', 'price', 'imageUrl', 'stock', 'isActive']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return ApiResponse.success(res, wishlist, 'Wishlist retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
};