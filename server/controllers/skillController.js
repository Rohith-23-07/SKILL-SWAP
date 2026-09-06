const Skill = require('../models/Skill');
const { getStatus, inMemorySkills } = require('../config/db');

// @desc    Get all skills with optional filter & search
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const { q, category, level } = req.query;
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      let query = {};

      if (category && category !== 'All') {
        query.category = category;
      }

      if (level && level !== 'All') {
        query.level = level;
      }

      if (q && q.trim() !== '') {
        const regex = new RegExp(q.trim(), 'i');
        query.$or = [
          { title: regex },
          { description: regex },
          { tags: regex },
          { swapPreferences: regex }
        ];
      }

      const skills = await Skill.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: skills.length,
        source: 'mongodb',
        data: skills
      });
    } else {
      // In-Memory Mode
      let results = [...inMemorySkills];

      if (category && category !== 'All') {
        results = results.filter(
          item => item.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (level && level !== 'All') {
        results = results.filter(
          item => item.level.toLowerCase() === level.toLowerCase()
        );
      }

      if (q && q.trim() !== '') {
        const queryTerm = q.trim().toLowerCase();
        results = results.filter(item =>
          item.title.toLowerCase().includes(queryTerm) ||
          item.description.toLowerCase().includes(queryTerm) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(queryTerm))) ||
          (item.swapPreferences && item.swapPreferences.toLowerCase().includes(queryTerm))
        );
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        source: 'in-memory-demo',
        data: results
      });
    }
  } catch (error) {
    console.error('Error in getSkills:', error);
    res.status(500).json({ success: false, message: 'Server error fetching skills', error: error.message });
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const skill = await Skill.findById(id);
      if (!skill) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }
      return res.status(200).json({ success: true, data: skill });
    } else {
      const skill = inMemorySkills.find(item => item.id === id || item._id === id);
      if (!skill) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }
      return res.status(200).json({ success: true, data: skill });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create new skill listing
// @route   POST /api/skills
// @access  Public (or authenticated)
const createSkill = async (req, res) => {
  try {
    const { title, description, category, level, swapPreferences, tags, userName, userUniversity } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category'
      });
    }

    const newSkillData = {
      title: title.trim(),
      description: description.trim(),
      category: category || 'Programming',
      level: level || 'Intermediate',
      swapPreferences: swapPreferences || 'Open to any relevant skills',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      user: {
        id: 'user-current',
        name: userName || 'Student Collaborator',
        university: userUniversity || 'Skill Swap University',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      },
      status: 'Active',
      createdAt: new Date()
    };

    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const created = await Skill.create(newSkillData);
      return res.status(201).json({
        success: true,
        message: 'Skill posted successfully to Cloud Database',
        data: created
      });
    } else {
      const newSkillWithId = {
        id: `skill-${Date.now()}`,
        _id: `mock-${Date.now()}`,
        ...newSkillData
      };
      inMemorySkills.unshift(newSkillWithId);

      return res.status(201).json({
        success: true,
        message: 'Skill posted successfully',
        data: newSkillWithId
      });
    }
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ success: false, message: 'Server error creating skill', error: error.message });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Public
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const updated = await Skill.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }
      return res.status(200).json({ success: true, data: updated });
    } else {
      const index = inMemorySkills.findIndex(item => item.id === id || item._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }
      inMemorySkills[index] = { ...inMemorySkills[index], ...req.body, updatedAt: new Date() };
      return res.status(200).json({ success: true, data: inMemorySkills[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating skill', error: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Public
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const deleted = await Skill.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }
      return res.status(200).json({ success: true, message: 'Skill listing deleted' });
    } else {
      const index = inMemorySkills.findIndex(item => item.id === id || item._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }
      inMemorySkills.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Skill listing deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting skill', error: error.message });
  }
};

// @desc    Get skill categories list & counts
// @route   GET /api/skills/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = [
    'Programming',
    'AI & Data Science',
    'Design',
    'DevOps & Cloud',
    'Languages',
    'Academic',
    'Other'
  ];
  res.status(200).json({ success: true, data: categories });
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getCategories
};
