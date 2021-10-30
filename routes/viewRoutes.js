const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();


router.get('/',authController.isLoggedIn,viewsController.getOverview);
router.get('/sendConsent',authController.protect,viewsController.sendConsentController);
router.get('/giveConsent',viewsController.giveConsentController);

router.get('/confirmConsent',viewsController.confirmConsentController);
router.get('/editAddress',viewsController.editAddressController);
router.get('/giveConsent/:id',viewsController.giveConsentController);

module.exports = router;