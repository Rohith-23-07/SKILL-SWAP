const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Skill = require('../models/Skill');
const { getStatus, inMemoryUsers, inMemorySkills } = require('../config/db');

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'skillswap_dev_secret_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new student user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, university, bio, skillsOffered, skillsWanted } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Pre-save hook on User schema handles bcrypt hashing
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        university: university ? university.trim() : 'State University',
        bio: bio ? bio.trim() : '',
        skillsOffered: Array.isArray(skillsOffered)
          ? skillsOffered
          : (typeof skillsOffered === 'string' && skillsOffered ? skillsOffered.split(',').map(s => s.trim()).filter(Boolean) : []),
        skillsWanted: Array.isArray(skillsWanted)
          ? skillsWanted
          : (typeof skillsWanted === 'string' && skillsWanted ? skillsWanted.split(',').map(s => s.trim()).filter(Boolean) : [])
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          university: user.university,
          bio: user.bio,
          skillsOffered: user.skillsOffered,
          skillsWanted: user.skillsWanted,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    } else {
      // In-Memory Mode
      const existing = inMemoryUsers.find(
        u => u.email.toLowerCase() === normalizedEmail
      );
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userId = `user-${Date.now()}`;
      const newUser = {
        id: userId,
        _id: userId,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        university: university ? university.trim() : 'State University',
        bio: bio ? bio.trim() : 'Excited to learn and share skills on Skill Swap!',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        skillsOffered: Array.isArray(skillsOffered)
          ? skillsOffered
          : (typeof skillsOffered === 'string' && skillsOffered ? skillsOffered.split(',').map(s => s.trim()).filter(Boolean) : ['General Tutoring']),
        skillsWanted: Array.isArray(skillsWanted)
          ? skillsWanted
          : (typeof skillsWanted === 'string' && skillsWanted ? skillsWanted.split(',').map(s => s.trim()).filter(Boolean) : ['Web Development']),
        createdAt: new Date()
      };

      inMemoryUsers.push(newUser);
      const token = generateToken(userId);

      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Registration successful (Local Demo)',
        token,
        user: userWithoutPassword
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Authenticate student & return JWT token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          university: user.university,
          avatar: user.avatar,
          bio: user.bio,
          skillsOffered: user.skillsOffered,
          skillsWanted: user.skillsWanted,
          createdAt: user.createdAt
        }
      });
    } else {
      // In-Memory Mode
      const user = inMemoryUsers.find(
        u => u.email.toLowerCase() === normalizedEmail
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user.id || user._id);
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        message: 'Login successful (Demo Mode)',
        token,
        user: userWithoutPassword
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
const getMe = async (req, res) => {
  try {
    // req.user is set by auth protect middleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
      error: error.message
    });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/me
// @access  Private (Protected by JWT)
const updateMe = async (req, res) => {
  try {
    const { name, university, bio, skillsOffered, skillsWanted, avatar } = req.body;
    const { cloudConnected } = getStatus();
    const userId = req.user._id || req.user.id;

    if (cloudConnected) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name.trim();
      if (university) user.university = university.trim();
      if (bio !== undefined) user.bio = bio.trim();
      if (avatar) user.avatar = avatar.trim();
      if (skillsOffered !== undefined) {
        user.skillsOffered = Array.isArray(skillsOffered)
          ? skillsOffered
          : skillsOffered.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (skillsWanted !== undefined) {
        user.skillsWanted = Array.isArray(skillsWanted)
          ? skillsWanted
          : skillsWanted.split(',').map(s => s.trim()).filter(Boolean);
      }

      const updatedUser = await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          university: updatedUser.university,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          skillsOffered: updatedUser.skillsOffered,
          skillsWanted: updatedUser.skillsWanted,
          createdAt: updatedUser.createdAt
        }
      });
    } else {
      // In-Memory Mode
      const userIndex = inMemoryUsers.findIndex(
        u => u.id === userId || u._id === userId
      );

      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const currentUser = inMemoryUsers[userIndex];
      if (name) currentUser.name = name.trim();
      if (university) currentUser.university = university.trim();
      if (bio !== undefined) currentUser.bio = bio.trim();
      if (avatar) currentUser.avatar = avatar.trim();
      if (skillsOffered !== undefined) {
        currentUser.skillsOffered = Array.isArray(skillsOffered)
          ? skillsOffered
          : skillsOffered.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (skillsWanted !== undefined) {
        currentUser.skillsWanted = Array.isArray(skillsWanted)
          ? skillsWanted
          : skillsWanted.split(',').map(s => s.trim()).filter(Boolean);
      }

      inMemoryUsers[userIndex] = currentUser;
      const { password: _, ...userWithoutPassword } = currentUser;

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message
    });
  }
};

// @desc    Get public student profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'Student profile not found' });
      }

      // Also fetch their active skills
      const userSkills = await Skill.find({ 'user.id': id.toString(), status: 'Active' }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        user,
        skills: userSkills
      });
    } else {
      // In-Memory Mode
      const user = inMemoryUsers.find(u => u.id === id || u._id === id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Student profile not found' });
      }

      const { password: _, ...userWithoutPassword } = user;

      // Find skills listed by this student
      const userSkills = inMemorySkills.filter(
        s => s.user && (s.user.id === id || s.user.id === user.id || s.user.id === user._id)
      );

      return res.status(200).json({
        success: true,
        user: userWithoutPassword,
        skills: userSkills
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching student profile',
      error: error.message
    });
  }
};

// @desc    Get all registered student profiles
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  const { cloudConnected } = getStatus();
  if (cloudConnected) {
    const users = await User.find().select('-password');
    return res.status(200).json({ success: true, count: users.length, data: users });
  } else {
    const usersWithoutPassword = inMemoryUsers.map(({ password, ...rest }) => rest);
    return res.status(200).json({ success: true, count: usersWithoutPassword.length, data: usersWithoutPassword });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  getUserById,
  getUsers
};
