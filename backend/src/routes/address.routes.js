const express = require('express');
const { getAddresses, addAddress, deleteAddress } = require('../controllers/address.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // All address routes require authentication

router.route('/')
  .get(getAddresses)
  .post(addAddress);

router.route('/:id')
  .delete(deleteAddress);

module.exports = router;
