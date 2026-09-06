const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Skill title is required'],
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, 'Skill description is required'],
      maxlength: 2000
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Programming',
        'AI & Data Science',
        'Design',
        'DevOps & Cloud',
        'Languages',
        'Academic',
        'Other'
      ],
      default: 'Programming'
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    },
    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      university: { type: String, default: 'University Student' },
      avatar: { type: String, default: '' }
    },
    swapPreferences: {
      type: String,
      default: 'Open to various skills'
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Active', 'In Progress', 'Completed'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for searching
skillSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
