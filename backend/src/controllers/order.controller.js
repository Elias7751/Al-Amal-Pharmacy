const OrderService = require('../services/order.service');
const ApiResponse = require('../utils/apiResponse');

exports.checkout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;
    if (!shippingAddress) {
      return ApiResponse.error(res, 'Shipping address is required', 400);
    }
    const order = await OrderService.checkout(req.user.id, shippingAddress, paymentMethod, couponCode);
    return ApiResponse.success(res, 'Order placed successfully', order, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await OrderService.getUserOrders(req.user.id);
    return ApiResponse.success(res, 'Orders retrieved successfully', orders);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    // If user is admin, they could theoretically fetch any order.
    // For now, this just uses the user's ID to fetch their own order.
    const order = await OrderService.getOrderById(req.user.id, req.params.id);
    return ApiResponse.success(res, 'Order retrieved successfully', order);
  } catch (error) {
    return ApiResponse.error(res, error.message, 404);
  }
};

// --- Admin Endpoints ---

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    return ApiResponse.success(res, 'All orders retrieved successfully', orders);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await OrderService.updateOrderStatus(req.params.id, { status, paymentStatus });
    return ApiResponse.success(res, 'Order status updated successfully', order);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};
