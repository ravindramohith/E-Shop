const router = require('express').Router();
const controller = require('../controllers/userControllers')
const mongooseIDValidation = require('../middlewares/mongooseIdValidation');
const authController = require('../controllers/authControllers');

router.route('/SignUp')
    .post(authController.SignUp)

router.route('/')
    .get(
        authController.protect, authController.restrictToAdmin(), 
        controller.getUsers)

router.route('/:id')
    .get(
        authController.protect,
        mongooseIDValidation.mongooseIDValidation, controller.getUser)
    .put(
        authController.protect,
        mongooseIDValidation.mongooseIDValidation, controller.updateUser)
    .delete(
        authController.protect,authController.restrictToAdmin(),
        mongooseIDValidation.mongooseIDValidation, controller.deleteUser)

router.route('/Login').post(authController.Login)

module.exports = router