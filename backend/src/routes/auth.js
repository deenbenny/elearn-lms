const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [learner, instructor, admin] }
 *               skillsOffered: { type: array, items: { type: string } }
 *               skillsWanted: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: User registered successfully }
 *       400: { description: User already exists }
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, skillsOffered, skillsWanted, bio } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role, skillsOffered, skillsWanted, bio });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, credits: user.credits, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful with JWT token }
 *       401: { description: Invalid credentials }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, credits: user.credits, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: User profile }
 *       401: { description: Not authorized }
 */
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
