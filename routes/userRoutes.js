//routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { User } = require('../models');

// User registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verify user presence
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    // Encrypt your password before saving it.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Token generation
    const token = jwt.sign({ id: newUser.id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Submit username
    res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    //Verify user presence
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'wrong email or password' });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'wrong email or password' });

    // Token generation
    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token with username
    res.status(200).json({
      message: 'You have successfully logged in.',
      user: { id: user.id, name: user.name, email: user.email },
      token: token
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
});



module.exports = router;
