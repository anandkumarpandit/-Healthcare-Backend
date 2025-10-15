const { validationResult } = require('express-validator');
const pool = require('../config/database');

const createDoctor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, specialization, license_number, hospital } = req.body;
    const created_by = req.user.id;

    const createDoctorQuery = `
      INSERT INTO doctors (name, email, phone, specialization, license_number, hospital, created_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    
    const result = await pool.query(createDoctorQuery, [
      name, email, phone, specialization, license_number, hospital, created_by
    ]);

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating doctor'
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const query = 'SELECT * FROM doctors ORDER BY created_at DESC';
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving doctors'
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM doctors WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor retrieved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving doctor'
    });
  }
};

const updateDoctor = async (req, res) => {
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
    const { name, email, phone, specialization, license_number, hospital } = req.body;

    const checkQuery = 'SELECT id FROM doctors WHERE id = $1 AND created_by = $2';
    const checkResult = await pool.query(checkQuery, [id, created_by]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const updateQuery = `
      UPDATE doctors 
      SET name = $1, email = $2, phone = $3, specialization = $4, license_number = $5, hospital = $6
      WHERE id = $7 AND created_by = $8
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [
      name, email, phone, specialization, license_number, hospital, id, created_by
    ]);

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating doctor'
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const created_by = req.user.id;

    const checkQuery = 'SELECT id FROM doctors WHERE id = $1 AND created_by = $2';
    const checkResult = await pool.query(checkQuery, [id, created_by]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const deleteQuery = 'DELETE FROM doctors WHERE id = $1 AND created_by = $2';
    await pool.query(deleteQuery, [id, created_by]);

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting doctor'
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};

