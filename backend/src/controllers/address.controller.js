const Address = require('../models/Address');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get user's addresses
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user.id },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
    });
    return ApiResponse.success(res, addresses, 'Addresses retrieved', 200);
  } catch (err) {
    next(err);
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const { title, addressLine, city, isDefault } = req.body;
    const userId = req.user.id;

    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId } });
    }

    const address = await Address.create({
      userId,
      title,
      addressLine,
      city,
      isDefault: isDefault || false
    });

    return ApiResponse.success(res, address, 'Address added successfully', 201);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    
    if (!address) {
      return ApiResponse.error(res, 'Address not found', 404);
    }

    await address.destroy();
    return ApiResponse.success(res, null, 'Address deleted', 200);
  } catch (err) {
    next(err);
  }
};
