const ProductService = require('../services/product.service');
const ApiResponse = require('../utils/apiResponse');

exports.getAll = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts(req.query);
    return ApiResponse.success(res, 'Products retrieved successfully', products);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    return ApiResponse.success(res, 'Product retrieved successfully', product);
  } catch (error) {
    return ApiResponse.error(res, error.message, 404);
  }
};

exports.create = async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body);
    return ApiResponse.success(res, 'Product created successfully', product, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.update = async (req, res) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    return ApiResponse.success(res, 'Product updated successfully', product);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.delete = async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    return ApiResponse.success(res, 'Product deleted successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};
