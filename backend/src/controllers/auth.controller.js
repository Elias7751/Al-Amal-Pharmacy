const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return ApiResponse.error(res, 'Please provide all required fields', 400);
    }

    const user = await AuthService.registerUser({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'customer', // Force customer role on public registration
    });

    const token = AuthService.generateToken(user.id);

    return ApiResponse.success(res, 'User registered successfully', {
      user,
      token,
    }, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 'Please provide email and password', 400);
    }

    const user = await AuthService.loginUser(email, password);
    const token = AuthService.generateToken(user.id);

    return ApiResponse.success(res, 'Login successful', {
      user,
      token,
    });
  } catch (error) {
    return ApiResponse.error(res, error.message, 401);
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    return ApiResponse.success(res, 'User retrieved successfully', {
      user: req.user,
    });
  } catch (error) {
    return ApiResponse.error(res, 'Failed to get user profile', 500);
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) return ApiResponse.error(res, 'User not found', 404);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();

    return ApiResponse.success(res, 'Profile updated successfully', { user });
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return ApiResponse.error(res, 'Please provide current and new password', 400);
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return ApiResponse.error(res, 'User not found', 404);

    // Check old password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.error(res, 'Incorrect current password', 401);
    }

    user.password = newPassword;
    await user.save();

    const token = AuthService.generateToken(user.id);

    return ApiResponse.success(res, 'Password updated successfully', { token });
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
};
