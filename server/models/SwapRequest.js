const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      university: { type: String, default: 'Student' },
      avatar: { type: String, default: '' }
    },
    receiver: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      university: { type: String, default: 'Student' },
      avatar: { type: String, default: '' }
    },
    skill: {
      id: { type: String, required: true },
      title: { type: String, required: true },
      category: { type: String, default: 'Programming' },
      level: { type: String, default: 'Intermediate' }
    },
    offeredSkill: {
      type: String,
      required: [true, 'Please specify the skill you are offering in return'],
      trim: true
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying pending requests quickly
swapRequestSchema.index({ 'requester.id': 1, 'skill.id': 1, status: 1 });
swapRequestSchema.index({ 'receiver.id': 1, status: 1 });

module.exports = mongoose.models.SwapRequest || mongoose.model('SwapRequest', swapRequestSchema);
