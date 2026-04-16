const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all active skills (with optional search/filter)
 *     tags: [Skills]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of skills }
 */
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    const skills = await Skill.find(query).populate('instructor', 'name rating');
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   get:
 *     summary: Get a skill by ID
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Skill details }
 *       404: { description: Skill not found }
 */
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('instructor', 'name bio rating totalSessions');
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create a new skill listing (instructor/admin only)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, creditsRequired]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               creditsRequired: { type: number }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Skill created }
 *       403: { description: Not authorized }
 */
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const skill = await Skill.create({ ...req.body, instructor: req.user._id });
    res.status(201).json(skill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: Update a skill (owner or admin only)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Skill updated }
 *       403: { description: Not authorized }
 *       404: { description: Skill not found }
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    if (skill.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this skill' });
    }
    const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete a skill (owner or admin only)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Skill deleted }
 *       403: { description: Not authorized }
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    if (skill.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this skill' });
    }
    await skill.deleteOne();
    res.json({ message: 'Skill removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
