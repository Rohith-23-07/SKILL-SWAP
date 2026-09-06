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

// Skill categories
router.get('/categories', getCategories);

// Skill collection routes
router.route('/')
  .get(getSkills)
  .post(createSkill);

// Single skill routes
router.route('/:id')
  .get(getSkillById)
  .put(updateSkill)
  .delete(deleteSkill);

module.exports = router;
