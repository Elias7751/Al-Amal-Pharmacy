const CartService = require('../services/cart.service');
const ApiResponse = require('../utils/apiResponse');

exports.getCart = async (req, res) => {
  try {
    const cart = await CartService.getCartByUserId(req.user.id);
    return ApiResponse.success(res, 'Cart retrieved successfully', cart);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return ApiResponse.error(res, 'Product ID and quantity are required', 400);
    }
    const cart = await CartService.addItemToCart(req.user.id, productId, quantity);
    return ApiResponse.success(res, 'Item added to cart', cart);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.removeItem = async (req, res) => {
  try {
    const cart = await CartService.removeItemFromCart(req.user.id, req.params.itemId);
    return ApiResponse.success(res, 'Item removed from cart', cart);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.clearCart = async (req, res) => {
  try {
    await CartService.clearCart(req.user.id);
    return ApiResponse.success(res, 'Cart cleared successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};
