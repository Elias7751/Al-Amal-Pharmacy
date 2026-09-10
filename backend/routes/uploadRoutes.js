const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Endpoint to upload a product image
router.post('/product', verifyToken, verifyAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/products/${req.file.filename}`;
    res.json({ success: true, message: 'Image uploaded successfully', imageUrl });
});

// Endpoint to upload a prescription
router.post('/prescription', verifyToken, upload.single('prescription'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/prescriptions/${req.file.filename}`;
    // You would typically insert a record into a `prescriptions` table here
    res.json({ success: true, message: 'Prescription uploaded successfully', fileUrl });
});

module.exports = router;
