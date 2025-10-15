const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');

const router = express.Router();

const doctorValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('specialization')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Specialization must not exceed 255 characters'),
  body('license_number')
    .optional()
    .isLength({ max: 100 })
    .withMessage('License number must not exceed 100 characters'),
  body('hospital')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Hospital name must not exceed 255 characters')
];

router.use(authenticateToken);

router.post('/', doctorValidation, createDoctor);

router.get('/', getDoctors);

router.get('/:id', getDoctorById);

router.put('/:id', doctorValidation, updateDoctor);

router.delete('/:id', deleteDoctor);

module.exports = router;

