const express = require('express');
const { body, param } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createMapping,
  getMappings,
  getDoctorsByPatient,
  deleteMapping
} = require('../controllers/mappingController');

const router = express.Router();

const mappingValidation = [
  body('patient_id')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer'),
  body('doctor_id')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters')
];

const patientIdValidation = [
  param('patient_id')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer')
];

router.use(authenticateToken);

router.post('/', mappingValidation, createMapping);

router.get('/', getMappings);

router.get('/:patient_id', patientIdValidation, getDoctorsByPatient);

router.delete('/:id', deleteMapping);

module.exports = router;

