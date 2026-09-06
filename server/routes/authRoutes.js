const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getUsers
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.get('/users', getUsers);

module.exports = router;
