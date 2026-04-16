const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  creditsUsed: { type: Number, required: true },
  notes: { type: String, default: '' },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
