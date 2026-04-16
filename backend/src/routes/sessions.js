const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Skill = require('../models/Skill');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get sessions for current user (learner sees own, instructor sees theirs, admin sees all)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of sessions }
 */
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'learner') query.learner = req.user._id;
    else if (req.user.role === 'instructor') query.instructor = req.user._id;
    const sessions = await Session.find(query)
      .populate('skill', 'title category')
      .populate('learner', 'name email')
      .populate('instructor', 'name email')
      .sort({ scheduledAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Request a session (learner only)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [skillId, scheduledAt]
 *             properties:
 *               skillId: { type: string }
 *               scheduledAt: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Session requested }
 *       400: { description: Insufficient credits or conflict }
 */
router.post('/', protect, authorize('learner', 'admin'), async (req, res) => {
  try {
    const { skillId, scheduledAt, notes } = req.body;
    const skill = await Skill.findById(skillId);
    if (!skill || !skill.isActive) return res.status(404).json({ message: 'Skill not found or inactive' });

    const learner = await User.findById(req.user._id);
    if (learner.credits < skill.creditsRequired) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // Check for conflicts
    const conflict = await Session.findOne({
      skill: skillId,
      scheduledAt: new Date(scheduledAt),
      status: { $in: ['pending', 'approved'] }
    });
    if (conflict) return res.status(400).json({ message: 'Time slot already booked for this skill' });

    const session = await Session.create({
      skill: skillId,
      learner: req.user._id,
      instructor: skill.instructor,
      scheduledAt,
      creditsUsed: skill.creditsRequired,
      notes
    });

    res.status(201).json(await session.populate(['skill', 'learner', 'instructor']));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/sessions/{id}/status:
 *   patch:
 *     summary: Update session status (instructor approves/rejects, learner cancels)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [approved, rejected, completed, cancelled] }
 *     responses:
 *       200: { description: Session status updated }
 *       403: { description: Not authorized }
 */
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const { status } = req.body;
    const isInstructor = session.instructor.toString() === req.user._id.toString();
    const isLearner = session.learner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isLearner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if ((status === 'approved' || status === 'rejected') && !isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Only instructor can approve/reject' });
    }

    session.status = status;

    // Deduct credits on approval, refund on rejection/cancellation
    if (status === 'approved') {
      await User.findByIdAndUpdate(session.learner, { $inc: { credits: -session.creditsUsed } });
    }
    if (status === 'rejected' || status === 'cancelled') {
      // Only refund if it was approved before
    }
    if (status === 'completed') {
      await User.findByIdAndUpdate(session.instructor, { $inc: { credits: session.creditsUsed, totalSessions: 1 } });
    }

    await session.save();
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/sessions/{id}/feedback:
 *   post:
 *     summary: Submit feedback for a completed session (learner only)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating: { type: number, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       200: { description: Feedback submitted }
 */
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the learner can submit feedback' });
    }
    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed sessions' });
    }
    session.feedback = req.body;
    await session.save();

    // Update instructor rating
    const sessions = await Session.find({ instructor: session.instructor, 'feedback.rating': { $exists: true } });
    const avg = sessions.reduce((sum, s) => sum + s.feedback.rating, 0) / sessions.length;
    await User.findByIdAndUpdate(session.instructor, { rating: Math.round(avg * 10) / 10 });

    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
