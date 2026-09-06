const Skill = require('../models/Skill');
const { getStatus, inMemorySkills } = require('../config/db');

// @desc    Get all skills with optional filter & search
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const { q, category, level, userId } = req.query;
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      let query = {};

      if (category && category !== 'All') {
        query.category = category;
      }

      if (level && level !== 'All') {
        query.level = level;
      }

      if (userId) {
        query['user.id'] = userId;
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

      if (userId) {
        results = results.filter(
          item => item.user && (item.user.id === userId || item.user._id === userId)
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
    res.status(500).json({
      success: false,
      message: 'Server error fetching skills',
      error: error.message
    });
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
// @access  Private (Requires Authentication)
const createSkill = async (req, res) => {
  try {
    const { title, description, category, level, swapPreferences, tags } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category'
      });
    }

    // Determine ownership strictly from authenticated req.user
    const userId = (req.user._id || req.user.id).toString();
    const newSkillData = {
      title: title.trim(),
      description: description.trim(),
      category: category || 'Programming',
      level: level || 'Intermediate',
      swapPreferences: swapPreferences ? swapPreferences.trim() : 'Open to relevant skill swap proposals',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      user: {
        id: userId,
        name: req.user.name,
        university: req.user.university || 'State University',
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
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
    res.status(500).json({
      success: false,
      message: 'Server error creating skill',
      error: error.message
    });
  }
};

// @desc    Update a skill (Owner Only)
// @route   PUT /api/skills/:id
// @access  Private (Requires Authentication)
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = (req.user._id || req.user.id).toString();
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const skill = await Skill.findById(id);
      if (!skill) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }

      // Verify Ownership
      if (skill.user.id.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized: You can only update your own skills'
        });
      }

      const { title, description, category, level, swapPreferences, tags, status } = req.body;
      if (title) skill.title = title.trim();
      if (description) skill.description = description.trim();
      if (category) skill.category = category;
      if (level) skill.level = level;
      if (swapPreferences !== undefined) skill.swapPreferences = swapPreferences.trim();
      if (tags) skill.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
      if (status) skill.status = status;

      const updated = await skill.save();

      return res.status(200).json({
        success: true,
        message: 'Skill listing updated successfully',
        data: updated
      });
    } else {
      const index = inMemorySkills.findIndex(item => item.id === id || item._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }

      const existingSkill = inMemorySkills[index];

      // Verify Ownership
      if (existingSkill.user.id.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized: You can only update your own skills'
        });
      }

      const { title, description, category, level, swapPreferences, tags, status } = req.body;
      const updatedSkill = {
        ...existingSkill,
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(category && { category }),
        ...(level && { level }),
        ...(swapPreferences !== undefined && { swapPreferences: swapPreferences.trim() }),
        ...(tags && { tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean) }),
        ...(status && { status }),
        updatedAt: new Date()
      };

      inMemorySkills[index] = updatedSkill;

      return res.status(200).json({
        success: true,
        message: 'Skill listing updated successfully',
        data: updatedSkill
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating skill',
      error: error.message
    });
  }
};

// @desc    Delete a skill (Owner Only)
// @route   DELETE /api/skills/:id
// @access  Private (Requires Authentication)
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = (req.user._id || req.user.id).toString();
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const skill = await Skill.findById(id);
      if (!skill) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }

      // Verify Ownership
      if (skill.user.id.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized: You can only delete your own skills'
        });
      }

      await Skill.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Skill listing deleted successfully'
      });
    } else {
      const index = inMemorySkills.findIndex(item => item.id === id || item._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }

      const existingSkill = inMemorySkills[index];

      // Verify Ownership
      if (existingSkill.user.id.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized: You can only delete your own skills'
        });
      }

      inMemorySkills.splice(index, 1);

      return res.status(200).json({
        success: true,
        message: 'Skill listing deleted successfully'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting skill',
      error: error.message
    });
  }
};

// @desc    Get skill categories list
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
