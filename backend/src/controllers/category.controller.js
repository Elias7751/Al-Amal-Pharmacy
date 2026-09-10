const CategoryService = require('../services/category.service');
const ApiResponse = require('../utils/apiResponse');

exports.getAll = async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategories();
    return ApiResponse.success(res, 'Categories retrieved successfully', categories);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id);
    return ApiResponse.success(res, 'Category retrieved successfully', category);
  } catch (error) {
    return ApiResponse.error(res, error.message, 404);
  }
};

exports.create = async (req, res) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    return ApiResponse.success(res, 'Category created successfully', category, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.update = async (req, res) => {
  try {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    return ApiResponse.success(res, 'Category updated successfully', category);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.delete = async (req, res) => {
  try {
    await CategoryService.deleteCategory(req.params.id);
    return ApiResponse.success(res, 'Category deleted successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};
