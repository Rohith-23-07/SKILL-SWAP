const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/authController');

// GET /api/users - Get all student profiles
router.get('/', getUsers);

// GET /api/users/:id - Get student public profile & active skills
router.get('/:id', getUserById);

module.exports = router;
