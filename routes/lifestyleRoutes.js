//routes/lifestyleRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { Lifestyle } = require('../models');
const Joi = require('joi');

// Validation schema with conditional goalHoursPerWeek
const lifestyleSchema = Joi.object({
  age: Joi.number().integer().min(0).required(),
  gender: Joi.string().valid('male', 'female').required(),
  lifeStatus: Joi.string().valid('working', 'student', 'unemployed', 'other').required(),
  goalHoursPerWeek: Joi.when('lifeStatus', {
    is: Joi.valid('working', 'student'),
    then: Joi.number().min(1).max(168).required(),
    otherwise: Joi.forbidden()
  })
});

// POST /profile - create or update lifestyle
router.post('/profile', auth, async (req, res) => {
  const { error } = lifestyleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { age, gender, lifeStatus, goalHoursPerWeek } = req.body;

  try {
    let lifestyle = await Lifestyle.findOne({ where: { userId: req.user.id } });

    if (lifestyle) {
      await lifestyle.update({ age, gender, lifeStatus, goalHoursPerWeek });
    } else {
      lifestyle = await Lifestyle.create({
        userId: req.user.id,
        age,
        gender,
        lifeStatus,
        goalHoursPerWeek
      });
    }

    res.status(201).json({
      message: 'Information saved successfully',
      user: {
        name: req.user.name
      },
      lifestyle
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
});

// GET /profile
router.get('/profile', auth, async (req, res) => {
  try {
    const lifestyle = await Lifestyle.findOne({ where: { userId: req.user.id } });

    if (!lifestyle) {
      return res.status(404).json({ error: 'Lifestyle profile not found' });
    }

    res.status(200).json({ lifestyle });
  } catch (error) {
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
});

module.exports = router;
