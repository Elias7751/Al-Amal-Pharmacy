const express = require('express');
const router = express.Router();
const { addAddress, getAddresses, deleteAddress } = require('../controllers/addressController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, addAddress);
router.get('/', verifyToken, getAddresses);
router.delete('/:id', verifyToken, deleteAddress);

module.exports = router;
