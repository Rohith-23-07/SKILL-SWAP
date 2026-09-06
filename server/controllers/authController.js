const User = require('../models/User');
const { getStatus, inMemoryUsers } = require('../config/db');

// @desc    Register user
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

    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password, // In a future iteration with full crypto, bcrypt will hash this
        university: university || 'State University',
        bio: bio || '',
        skillsOffered: Array.isArray(skillsOffered) ? skillsOffered : [],
        skillsWanted: Array.isArray(skillsWanted) ? skillsWanted : []
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          university: user.university,
          avatar: user.avatar
        },
        token: `mock-jwt-token-${user._id}`
      });
    } else {
      // In-Memory Mode
      const existing = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const newUser = {
        id: `user-${Date.now()}`,
        _id: `user-mock-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        university: university || 'State University',
        bio: bio || 'Excited to learn and share skills on Skill Swap!',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        skillsOffered: Array.isArray(skillsOffered) ? skillsOffered : ['General Tutoring'],
        skillsWanted: Array.isArray(skillsWanted) ? skillsWanted : ['Web Development'],
        createdAt: new Date()
      };

      inMemoryUsers.push(newUser);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (Local Demo)',
        user: newUser,
        token: `mock-jwt-token-${newUser.id}`
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const { cloudConnected } = getStatus();

    if (cloudConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Basic password check (production would use bcrypt.compare)
      if (user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          university: user.university,
          avatar: user.avatar,
          bio: user.bio
        },
        token: `jwt-token-${user._id}`
      });
    } else {
      // In-Memory Mode: accept any user from sampleUsers or auto-authenticate
      const user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || inMemoryUsers[0];

      return res.status(200).json({
        success: true,
        message: 'Login successful (Demo Mode)',
        user,
        token: `mock-jwt-token-${user.id}`
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Public
const getMe = async (req, res) => {
  // Returns demo student profile
  const user = inMemoryUsers[0];
  res.status(200).json({
    success: true,
    user
  });
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
    return res.status(200).json({ success: true, count: inMemoryUsers.length, data: inMemoryUsers });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getUsers
};
