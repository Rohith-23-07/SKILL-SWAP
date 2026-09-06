const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateMe,
  getUserById,
  getUsers
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public auth routes
router.post('/register', register);
router.post('/login', login);

// Authenticated user profile routes
router.route('/me')
  .get(protect, getMe)
  .put(protect, updateMe);

// Student public profiles
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

module.exports = router;
