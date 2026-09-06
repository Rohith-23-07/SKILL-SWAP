const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getCategories
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

// Public categories route
router.get('/categories', getCategories);

// Skill collection routes
router.route('/')
  .get(getSkills)
  .post(protect, createSkill);

// Single skill routes
router.route('/:id')
  .get(getSkillById)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;
