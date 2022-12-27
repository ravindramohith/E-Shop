const router = require('express').Router();
const mongooseIDValidation = require('../middlewares/mongooseIdValidation');
const authController = require('../controllers/authControllers');
const controller = require('../controllers/orderControllers');

router.route('/')
    .get(
        authController.protect,authController.restrictToAdmin(),
        controller.getOrders)
    .post(
        authController.protect,
        controller.placeOrder)

router.route('/:id')
    .get(
        authController.protect,
        mongooseIDValidation.mongooseIDValidation, controller.getOrder)
    .put(
        authController.protect,authController.restrictToAdmin(),
        mongooseIDValidation.mongooseIDValidation, controller.updateStatusOfOrder)
    .delete(
        authController.protect,
        mongooseIDValidation.mongooseIDValidation, controller.deleteOrder);

router.route('/get/sales')
    .get(
        authController.protect,authController.restrictToAdmin(),
        controller.getTotalSales)

router.route('/getproductsofUser/:userId')
    .get(
        authController.protect,
        controller.getUserOrders)
module.exports = router