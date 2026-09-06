const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    university: {
      type: String,
      default: 'University Student',
      trim: true
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    skillsOffered: {
      type: [String],
      default: []
    },
    skillsWanted: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

// Prevent re-compilation in development environments
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
