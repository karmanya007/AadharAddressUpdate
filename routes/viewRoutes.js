const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();


router.get('/',authController.isLoggedIn,viewsController.getOverview);
router.get('/sendConsent',authController.protect,viewsController.sendConsentController);
router.get('/giveConsent',authController.protect,viewsController.giveConsentController);
// router.get('/confirmConsent',viewsController.confirmConsentController);
router.get('/editAddress',authController.protect,viewsController.editAddressController);

router.get('/confirmConsent',viewsController.confirmConsentController);
router.get('/giveConsent/:id',viewsController.giveConsentController);
router.get('/giveConsent/:id/response',viewsController.giveConsentResponseController);

module.exports = router;