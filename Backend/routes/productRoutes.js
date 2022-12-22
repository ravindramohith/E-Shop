const router = require('express').Router();
const controller = require('../controllers/productControllers');
const mongooseIDValidation = require('../middlewares/mongooseIdValidation');
const authController = require('../controllers/authControllers');
const multerMiddleware = require('../middlewares/multerMiddleware');

router.route('/')
    .get(controller.getAllProducts)
    .post(authController.protect, authController.restrictToAdmin(), multerMiddleware.uploadOptions.single('image'), controller.createProduct);

router.route('/:id')
    .get(mongooseIDValidation.mongooseIDValidation, controller.getProduct)
    .put(authController.protect, authController.restrictToAdmin(), mongooseIDValidation.mongooseIDValidation, multerMiddleware.uploadOptions.single('image'), controller.updateProduct)
    .delete(authController.protect, authController.restrictToAdmin(), mongooseIDValidation.mongooseIDValidation, controller.deleteProduct);

router.route('/get/featured/:count')
    .get(authController.protect, controller.getFeaturedProducts)

router.route('/upload-gallery/:id')
    .patch(authController.protect, authController.restrictToAdmin(), mongooseIDValidation.mongooseIDValidation, multerMiddleware.uploadOptions.array('images', 10), controller.uploadGallery)

module.exports = router