 const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

//router.post('/login', authController.login);
router.post('/createAccount',userController.createAccountController);
module.exports = router; 