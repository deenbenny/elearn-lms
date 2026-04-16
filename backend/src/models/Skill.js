const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Music', 'Languages', 'Arts', 'Sports', 'Cooking', 'Academic', 'Other']
  },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creditsRequired: { type: Number, required: true, min: 1 },
  maxParticipants: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
