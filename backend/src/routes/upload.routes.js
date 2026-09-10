const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/upload.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Route: POST /api/upload
// Desc: Upload an image and get URL
// Access: Admin
router.post('/', protect, authorize('admin'), upload.single('image'), uploadImage);

module.exports = router;
