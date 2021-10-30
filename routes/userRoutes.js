 const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
// router.get('/logout', authController.logout);

router.post('/createAccount',userController.createAccountController);
router.post('/sendSMS/:num',userController.sendLLSMSController);

router.use(authController.restrictTo('admin'));
router
	.route('/')
	.get(userController.getAllUsers);
router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router; 