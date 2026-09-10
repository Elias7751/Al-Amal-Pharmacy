const PrescriptionService = require('../services/prescription.service');
const ApiResponse = require('../utils/apiResponse');

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 'Please upload an image file', 400);
    }
    
    // The path where the file is stored relative to the server
    const imagePath = `/uploads/prescriptions/${req.file.filename}`;
    const { userNotes } = req.body;

    const prescription = await PrescriptionService.uploadPrescription(req.user.id, imagePath, userNotes);
    return ApiResponse.success(res, 'Prescription uploaded successfully', prescription, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await PrescriptionService.getUserPrescriptions(req.user.id);
    return ApiResponse.success(res, 'Prescriptions retrieved successfully', prescriptions);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await PrescriptionService.getPrescriptionById(req.user.id, req.params.id);
    return ApiResponse.success(res, 'Prescription retrieved successfully', prescription);
  } catch (error) {
    return ApiResponse.error(res, error.message, 404);
  }
};

// --- Admin Endpoints ---

exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await PrescriptionService.getAllPrescriptions();
    return ApiResponse.success(res, 'All prescriptions retrieved successfully', prescriptions);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const prescription = await PrescriptionService.updateStatus(req.params.id, status, adminNotes);
    return ApiResponse.success(res, 'Prescription status updated successfully', prescription);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};
