const router = require('express').Router();
const { Category } = require('../models/Category');
const categoryController = require('../controllers/categoryControllers');

router.get('/', categoryController.getAllCategories).post('/', categoryController.createCategory);
router.get('/:id', categoryController.getCategory).delete('/:id', categoryController.deleteCategory).put('/:id', categoryController.updateCategory);

module.exports = router