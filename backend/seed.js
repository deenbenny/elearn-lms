require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Models ──────────────────────────────────────────────────────────────────
const User = require('./src/models/User');
const Skill = require('./src/models/Skill');
const Session = require('./src/models/Session');

// ── Demo Data ────────────────────────────────────────────────────────────────
const users = [
  // Admin
  { name: 'Admin Benedict', email: 'admin@elearn.com', password: 'admin123', role: 'admin', bio: 'Platform administrator', credits: 99, skillsOffered: [], skillsWanted: [] },

  // Instructors
  { name: 'Priya Sharma', email: 'priya@elearn.com', password: 'pass123', role: 'instructor', bio: 'Full Stack Developer with 5 years experience in React and Node.js', credits: 12, skillsOffered: ['React', 'Node.js', 'JavaScript'], skillsWanted: ['Guitar', 'Cooking'] },
  { name: 'Arjun Mehta', email: 'arjun@elearn.com', password: 'pass123', role: 'instructor', bio: 'Classical guitarist and music teacher with 10 years of teaching experience', credits: 8, skillsOffered: ['Guitar', 'Music Theory', 'Piano'], skillsWanted: ['Python', 'Data Science'] },
  { name: 'Kavitha Nair', email: 'kavitha@elearn.com', password: 'pass123', role: 'instructor', bio: 'Professional chef specialising in South Indian and continental cuisine', credits: 15, skillsOffered: ['Cooking', 'Baking', 'Nutrition'], skillsWanted: ['Yoga', 'Photography'] },
  { name: 'Rahul Verma', email: 'rahul@elearn.com', password: 'pass123', role: 'instructor', bio: 'Data Scientist at a leading tech firm, passionate about teaching ML', credits: 6, skillsOffered: ['Python', 'Machine Learning', 'Data Analysis'], skillsWanted: ['Spanish', 'Guitar'] },
  { name: 'Sneha Patel', email: 'sneha@elearn.com', password: 'pass123', role: 'instructor', bio: 'Yoga instructor certified by Yoga Alliance with 7 years experience', credits: 10, skillsOffered: ['Yoga', 'Meditation', 'Fitness'], skillsWanted: ['JavaScript', 'Web Design'] },

  // Learners
  { name: 'Vikram Iyer', email: 'vikram@elearn.com', password: 'pass123', role: 'learner', bio: 'Software engineer looking to learn music and cooking', credits: 5, skillsOffered: [], skillsWanted: ['Guitar', 'Cooking', 'Yoga'] },
  { name: 'Ananya Reddy', email: 'ananya@elearn.com', password: 'pass123', role: 'learner', bio: 'Marketing professional exploring tech skills', credits: 5, skillsOffered: [], skillsWanted: ['Python', 'React', 'Data Analysis'] },
  { name: 'Karthik Raj', email: 'karthik@elearn.com', password: 'pass123', role: 'learner', bio: 'College student interested in programming and fitness', credits: 5, skillsOffered: [], skillsWanted: ['Machine Learning', 'Yoga', 'Guitar'] },
];

const skillsData = [
  // Technology
  { title: 'React.js for Beginners', description: 'Learn React from scratch — components, hooks, state management, and building your first SPA. No prior React knowledge needed, basic JavaScript required.', category: 'Technology', creditsRequired: 3, tags: ['react', 'javascript', 'frontend', 'beginner'], instructorEmail: 'priya@elearn.com' },
  { title: 'Node.js & Express REST APIs', description: 'Build production-grade REST APIs using Node.js and Express. Covers routing, middleware, JWT authentication, and MongoDB integration.', category: 'Technology', creditsRequired: 3, tags: ['nodejs', 'express', 'backend', 'api'], instructorEmail: 'priya@elearn.com' },
  { title: 'Python for Data Science', description: 'Master Python fundamentals and data science libraries — NumPy, Pandas, Matplotlib. Hands-on with real datasets.', category: 'Technology', creditsRequired: 2, tags: ['python', 'data science', 'pandas', 'numpy'], instructorEmail: 'rahul@elearn.com' },
  { title: 'Machine Learning Fundamentals', description: 'Understand ML concepts: supervised vs unsupervised learning, regression, classification, clustering. Implement models using scikit-learn.', category: 'Technology', creditsRequired: 4, tags: ['machine learning', 'AI', 'scikit-learn', 'python'], instructorEmail: 'rahul@elearn.com' },

  // Music
  { title: 'Acoustic Guitar — Absolute Beginners', description: 'Learn guitar from zero. Covers posture, basic chords (C, D, G, Am, Em), strumming patterns, and your first 3 songs.', category: 'Music', creditsRequired: 2, tags: ['guitar', 'acoustic', 'beginner', 'chords'], instructorEmail: 'arjun@elearn.com' },
  { title: 'Music Theory Essentials', description: 'Understand scales, chords, intervals, and rhythm. Perfect for any instrumentalist who wants to read and compose music.', category: 'Music', creditsRequired: 2, tags: ['music theory', 'scales', 'chords', 'composition'], instructorEmail: 'arjun@elearn.com' },

  // Cooking
  { title: 'South Indian Cooking Masterclass', description: 'Learn authentic South Indian recipes — dosa, sambar, rasam, and chutneys. From scratch, no shortcuts.', category: 'Cooking', creditsRequired: 2, tags: ['south indian', 'dosa', 'cooking', 'recipes'], instructorEmail: 'kavitha@elearn.com' },
  { title: 'Baking Basics: Breads & Cakes', description: 'Learn the science of baking. Make sourdough bread, banana bread, and chocolate cake from scratch with simple ingredients.', category: 'Cooking', creditsRequired: 2, tags: ['baking', 'bread', 'cake', 'desserts'], instructorEmail: 'kavitha@elearn.com' },

  // Sports / Fitness
  { title: 'Yoga for Stress Relief', description: 'A beginner-friendly yoga session focusing on breathing, gentle stretches, and mindfulness techniques to reduce daily stress.', category: 'Sports', creditsRequired: 1, tags: ['yoga', 'stress', 'beginner', 'mindfulness'], instructorEmail: 'sneha@elearn.com' },
  { title: 'Morning Meditation Practice', description: '20-minute guided meditation session. Learn breathing techniques, body scan, and how to build a daily meditation habit.', category: 'Sports', creditsRequired: 1, tags: ['meditation', 'mindfulness', 'breathing', 'morning'], instructorEmail: 'sneha@elearn.com' },
];

// ── Seed Function ─────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Session.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users (passwords hashed via pre-save hook)
    const createdUsers = await User.create(users);
    console.log(`👤 Created ${createdUsers.length} users`);

    // Map email → user object for easy lookup
    const userMap = {};
    createdUsers.forEach(u => { userMap[u.email] = u; });

    // Create skills
    const skillDocs = skillsData.map(s => ({
      ...s,
      instructor: userMap[s.instructorEmail]._id,
    }));
    const createdSkills = await Skill.create(skillDocs);
    console.log(`📚 Created ${createdSkills.length} skills`);

    // Create demo sessions
    const sessions = [
      // Completed session with feedback
      {
        skill: createdSkills[0]._id,         // React.js for Beginners
        learner: userMap['vikram@elearn.com']._id,
        instructor: userMap['priya@elearn.com']._id,
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        status: 'completed',
        creditsUsed: 3,
        notes: 'Want to understand React hooks in detail',
        feedback: { rating: 5, comment: 'Excellent session! Priya explained hooks very clearly.' }
      },
      // Approved upcoming session
      {
        skill: createdSkills[4]._id,         // Guitar Beginners
        learner: userMap['vikram@elearn.com']._id,
        instructor: userMap['arjun@elearn.com']._id,
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'approved',
        creditsUsed: 2,
        notes: 'Complete beginner, never touched a guitar before',
      },
      // Pending session
      {
        skill: createdSkills[2]._id,         // Python for Data Science
        learner: userMap['ananya@elearn.com']._id,
        instructor: userMap['rahul@elearn.com']._id,
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'pending',
        creditsUsed: 2,
        notes: 'I know basic Python, want to move into data science',
      },
      // Another pending
      {
        skill: createdSkills[8]._id,         // Yoga
        learner: userMap['karthik@elearn.com']._id,
        instructor: userMap['sneha@elearn.com']._id,
        scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
        status: 'pending',
        creditsUsed: 1,
        notes: 'Looking to manage exam stress',
      },
      // Completed with feedback
      {
        skill: createdSkills[6]._id,         // South Indian Cooking
        learner: userMap['ananya@elearn.com']._id,
        instructor: userMap['kavitha@elearn.com']._id,
        scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: 'completed',
        creditsUsed: 2,
        notes: 'Want to learn authentic dosa recipe',
        feedback: { rating: 4, comment: 'Great session, learned a lot about the batter fermentation process.' }
      },
    ];

    const createdSessions = await Session.create(sessions);
    console.log(`📅 Created ${createdSessions.length} sessions`);

    // Update instructor ratings and credits from completed sessions
    await User.findByIdAndUpdate(userMap['priya@elearn.com']._id, { rating: 5, totalSessions: 1, $inc: { credits: 3 } });
    await User.findByIdAndUpdate(userMap['kavitha@elearn.com']._id, { rating: 4, totalSessions: 1, $inc: { credits: 2 } });
    // Deduct credits from learners for approved/completed sessions
    await User.findByIdAndUpdate(userMap['vikram@elearn.com']._id, { $inc: { credits: -5 } }); // 3 + 2
    await User.findByIdAndUpdate(userMap['ananya@elearn.com']._id, { $inc: { credits: -2 } }); // completed cooking

    console.log('\n✅ Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  LOGIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ADMIN');
    console.log('  Email:    admin@elearn.com');
    console.log('  Password: admin123\n');
    console.log('  INSTRUCTORS');
    console.log('  priya@elearn.com    / pass123  (React, Node.js)');
    console.log('  arjun@elearn.com    / pass123  (Guitar, Music)');
    console.log('  kavitha@elearn.com  / pass123  (Cooking, Baking)');
    console.log('  rahul@elearn.com    / pass123  (Python, ML)');
    console.log('  sneha@elearn.com    / pass123  (Yoga, Meditation)\n');
    console.log('  LEARNERS');
    console.log('  vikram@elearn.com   / pass123');
    console.log('  ananya@elearn.com   / pass123');
    console.log('  karthik@elearn.com  / pass123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
