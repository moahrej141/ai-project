//routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const { Goal } = require('../models'); // Assuming Goal is the model for user goals

// POST /goals: Save user goals
router.post('/goals', auth, async (req, res) => {
  const { goalName, targetDate } = req.body;

  // Validate input: Ensure both goalName and targetDate are provided
  if (!goalName || !targetDate) {
    return res.status(400).json({ message: 'Goal name and target date are required.' });
  }

  try {
    // Create a new goal
    const newGoal = await Goal.create({
      userId: req.user.id,
      goalName,
      targetDate
    });

    res.status(201).json({
      message: 'Goal created successfully',
      goal: newGoal
    });
  } catch (error) {
    res.status(500).json({ error: 'Error saving goal', detail: error.message });
  }
});


// GET goals
router.get('/goals', auth, async (req, res) => {
  try {

    const goals = await Goal.findAll({ where: { userId: req.user.id } });

    res.status(200).json({
      message: 'Goals GET successfully',
      goals
    });
  } catch (error) {
    res.status(500).json({ error: 'Error GET goals', detail: error.message });
  }
});

module.exports = router;

