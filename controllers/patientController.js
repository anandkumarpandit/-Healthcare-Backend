const { validationResult } = require('express-validator');
const pool = require('../config/database');

const createPatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, date_of_birth, address, medical_history } = req.body;
    const created_by = req.user.id;

    const createPatientQuery = `
      INSERT INTO patients (name, email, phone, date_of_birth, address, medical_history, created_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    
    const result = await pool.query(createPatientQuery, [
      name, email, phone, date_of_birth, address, medical_history, created_by
    ]);

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating patient'
    });
  }
};

const getPatients = async (req, res) => {
  try {
    const created_by = req.user.id;
    const query = 'SELECT * FROM patients WHERE created_by = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [created_by]);

    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving patients'
    });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const created_by = req.user.id;

    const query = 'SELECT * FROM patients WHERE id = $1 AND created_by = $2';
    const result = await pool.query(query, [id, created_by]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient retrieved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving patient'
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const created_by = req.user.id;
    const { name, email, phone, date_of_birth, address, medical_history } = req.body;

    const checkQuery = 'SELECT id FROM patients WHERE id = $1 AND created_by = $2';
    const checkResult = await pool.query(checkQuery, [id, created_by]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const updateQuery = `
      UPDATE patients 
      SET name = $1, email = $2, phone = $3, date_of_birth = $4, address = $5, medical_history = $6
      WHERE id = $7 AND created_by = $8
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [
      name, email, phone, date_of_birth, address, medical_history, id, created_by
    ]);

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating patient'
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const created_by = req.user.id;

    const checkQuery = 'SELECT id FROM patients WHERE id = $1 AND created_by = $2';
    const checkResult = await pool.query(checkQuery, [id, created_by]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const deleteQuery = 'DELETE FROM patients WHERE id = $1 AND created_by = $2';
    await pool.query(deleteQuery, [id, created_by]);

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting patient'
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
};

