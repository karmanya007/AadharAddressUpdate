 const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const User = require('../models/userModel')
const router = express.Router();

router.post('/login', authController.login);
// router.get('/logout', authController.logout);

router.post('/sendSMS/:num',userController.sendLLSMSController);
router.post('/postConsent/:id',userController.postConsentController);
router.post('/getEkyc',userController.getEkycController);
router.post('/getAddress',userController.getAddress);
router.get('/status/:id',async (req,res)=>
{
const result = await User.findOne({targetId:req.params.id},(err,data)=>
{
	console.log(data);
	if(err)
	{
		console.log(err);
	}
}).clone()
	res.render('status',{status:result.status, url: req.params.id})
})
/* router.use(authController.restrictTo('admin')); */
router
	.route('/')
	.get(userController.getAllUsers);
router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router; 