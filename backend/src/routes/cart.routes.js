const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

// All cart routes require user to be logged in
router.use(protect);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
