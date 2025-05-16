const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const calendarController = require('../controllers/calendarController');
const auth = require('../middleware/authMiddleware');

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // دقيقة واحدة
  max: 10,
  message: { message: 'Maximum number of requests exceeded. Please try again later.' },
});

const validateCalendarInput = [
  body('lifestyle.age').isInt({ min: 1 }).withMessage('Age must be an integer greater than zero.'),
  body('lifestyle.gender').isIn(['male', 'female']).withMessage('Gender must be "male" or "female".'),
  body('lifestyle.lifeStatus').notEmpty().withMessage('Life condition required.'),
  body('lifestyle.availbleHPW').isInt({ min: 0 }).withMessage('Available hours should be a number.'),
  body('goals').notEmpty().withMessage('Desired objectives.'),
];

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.post(
  '/generate',
  auth,
  aiLimiter,
  validateCalendarInput,
  validationMiddleware,
  calendarController.generateCalendarHandler
);

router.get('/', auth, calendarController.getCalendarHandler);

module.exports = router;
