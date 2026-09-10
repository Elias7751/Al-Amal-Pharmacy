const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

// All routes require authentication
router.use(protect);

// User routes
// Use multer middleware to handle the 'image' field upload
router.post('/', upload.single('image'), prescriptionController.upload);
router.get('/my-prescriptions', prescriptionController.getMyPrescriptions);
router.get('/my-prescriptions/:id', prescriptionController.getPrescriptionById);

// Admin routes
router.get('/', authorize('admin'), prescriptionController.getAllPrescriptions);
router.put('/:id/status', authorize('admin'), prescriptionController.updateStatus);

module.exports = router;
