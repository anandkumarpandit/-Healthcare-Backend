const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} = require('../controllers/patientController');

const router = express.Router();

const patientValidation = [
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
  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)'),
  body('address')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Address must not exceed 1000 characters'),
  body('medical_history')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Medical history must not exceed 2000 characters')
];

router.use(authenticateToken);

router.post('/', patientValidation, createPatient);

router.get('/', getPatients);

router.get('/:id', getPatientById);

router.put('/:id', patientValidation, updatePatient);

router.delete('/:id', deletePatient);

module.exports = router;

