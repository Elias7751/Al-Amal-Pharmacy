const express = require('express');
const { getInventory, addMovement } = require('../controllers/inventory.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Only admins can access inventory routes

router.route('/')
  .get(getInventory)
  .post(addMovement);

module.exports = router;
