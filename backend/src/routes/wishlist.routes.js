const express = require('express');
const { toggleWishlist, getWishlist } = require('../controllers/wishlist.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // All wishlist routes require authentication

router.route('/')
  .get(getWishlist);

router.route('/toggle')
  .post(toggleWishlist);

module.exports = router;
