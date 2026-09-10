const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Server Error' }
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['admin', 'customer'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid role specified' }
      });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Prevent changing the role of the main admin if necessary (optional)
    if (user.email === 'admin_850419@alamal.com' && role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Cannot change the role of the master admin' }
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Server Error' }
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Prevent deleting the master admin
    if (user.email === 'admin_850419@alamal.com') {
      return res.status(403).json({
        success: false,
        error: { message: 'Cannot delete the master admin' }
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Server Error' }
    });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser
};
