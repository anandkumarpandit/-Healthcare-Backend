const { validationResult } = require("express-validator");
const pool = require("../config/database");

const createMapping = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { patient_id, doctor_id, notes } = req.body;
    const created_by = req.user.id;

    const patientQuery =
      "SELECT id FROM patients WHERE id = $1 AND created_by = $2";
    const patientResult = await pool.query(patientQuery, [
      patient_id,
      created_by,
    ]);

    if (patientResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Patient not found or you do not have permission to assign doctors to this patient",
      });
    }

    const doctorQuery = "SELECT id FROM doctors WHERE id = $1";
    const doctorResult = await pool.query(doctorQuery, [doctor_id]);

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const existingMappingQuery =
      "SELECT id FROM patient_doctor_mappings WHERE patient_id = $1 AND doctor_id = $2";
    const existingMapping = await pool.query(existingMappingQuery, [
      patient_id,
      doctor_id,
    ]);

    if (existingMapping.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This doctor is already assigned to this patient",
      });
    }

    const createMappingQuery = `
      INSERT INTO patient_doctor_mappings (patient_id, doctor_id, notes, created_by) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;

    const result = await pool.query(createMappingQuery, [
      patient_id,
      doctor_id,
      notes,
      created_by,
    ]);

    res.status(201).json({
      success: true,
      message: "Doctor assigned to patient successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create mapping error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating mapping",
    });
  }
};

const getMappings = async (req, res) => {
  try {
    const query = `
      SELECT 
        pdm.*,
        p.name as patient_name,
        p.email as patient_email,
        d.name as doctor_name,
        d.email as doctor_email,
        d.specialization
      FROM patient_doctor_mappings pdm
      JOIN patients p ON pdm.patient_id = p.id
      JOIN doctors d ON pdm.doctor_id = d.id
      ORDER BY pdm.assigned_at DESC
    `;
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      message: "Mappings retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Get mappings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while retrieving mappings",
    });
  }
};

const getDoctorsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const created_by = req.user.id;

    const patientQuery =
      "SELECT id FROM patients WHERE id = $1 AND created_by = $2";
    const patientResult = await pool.query(patientQuery, [
      patient_id,
      created_by,
    ]);

    if (patientResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Patient not found or you do not have permission to view this patient",
      });
    }

    const query = `
      SELECT 
        pdm.*,
        d.name as doctor_name,
        d.email as doctor_email,
        d.phone as doctor_phone,
        d.specialization,
        d.license_number,
        d.hospital
      FROM patient_doctor_mappings pdm
      JOIN doctors d ON pdm.doctor_id = d.id
      WHERE pdm.patient_id = $1
      ORDER BY pdm.assigned_at DESC
    `;
    const result = await pool.query(query, [patient_id]);

    res.status(200).json({
      success: true,
      message: "Patient doctors retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Get doctors by patient error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while retrieving patient doctors",
    });
  }
};

const deleteMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const created_by = req.user.id;

    const checkQuery = `
      SELECT pdm.id 
      FROM patient_doctor_mappings pdm
      JOIN patients p ON pdm.patient_id = p.id
      WHERE pdm.id = $1 AND p.created_by = $2
    `;
    const checkResult = await pool.query(checkQuery, [id, created_by]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Mapping not found or you do not have permission to remove this mapping",
      });
    }

    const deleteQuery = "DELETE FROM patient_doctor_mappings WHERE id = $1";
    await pool.query(deleteQuery, [id]);

    res.status(200).json({
      success: true,
      message: "Doctor removed from patient successfully",
    });
  } catch (error) {
    console.error("Delete mapping error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting mapping",
    });
  }
};

module.exports = {
  createMapping,
  getMappings,
  getDoctorsByPatient,
  deleteMapping,
};
