const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getStatus, inMemoryUsers } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no authentication token provided'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'skillswap_dev_secret_key_2026'
    );

    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user account not found'
        });
      }
      req.user = user;
    } else {
      // In-Memory Mode
      const user = inMemoryUsers.find(
        u => u.id === decoded.id || u._id === decoded.id
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user account not found'
        });
      }

      // Exclude password from req.user
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }

    next();
  } catch (error) {
    console.error('JWT Auth Middleware Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token is invalid or expired'
    });
  }
};

module.exports = { protect };
