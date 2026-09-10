const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', verifyToken, verifyAdmin, addCategory);
router.put('/:id', verifyToken, verifyAdmin, updateCategory);
router.delete('/:id', verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
