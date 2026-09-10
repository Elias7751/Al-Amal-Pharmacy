const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
  // Generate JWT Token
  static generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  static async registerUser(userData) {
    const { firstName, lastName, email, password, phone, role } = userData;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'customer',
    });

    return user;
  }

  static async loginUser(email, password) {
    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('User account is disabled');
    }

    return user;
  }
}

module.exports = AuthService;
