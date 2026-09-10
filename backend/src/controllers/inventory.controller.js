const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all inventory movements
// @route   GET /api/inventory
// @access  Private/Admin
exports.getInventory = async (req, res, next) => {
  try {
    const movements = await Inventory.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name_ar', 'name_en', 'stock']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return ApiResponse.success(res, movements, 'Inventory movements retrieved', 200);
  } catch (err) {
    next(err);
  }
};

// @desc    Add manual stock movement
// @route   POST /api/inventory
// @access  Private/Admin
exports.addMovement = async (req, res, next) => {
  try {
    const { productId, type, quantity, reference, notes } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }

    const movement = await Inventory.create({
      productId,
      type,
      quantity,
      reference,
      notes
    });

    // Update the actual product stock
    if (type === 'IN') {
      product.stock += parseInt(quantity);
    } else {
      product.stock -= parseInt(quantity);
      if (product.stock < 0) product.stock = 0;
    }
    await product.save();

    return ApiResponse.success(res, movement, 'Inventory movement added', 201);
  } catch (err) {
    next(err);
  }
};
