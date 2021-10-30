const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/',viewsController.getOverview);
router.get('/sendConsent',viewsController.sendConsentController);
//router.get('/giveConsent',viewsController.giveConsentController);
router.get('/confirmConsent',viewsController.confirmConsentController);
router.get('/editAddress',viewsController.editAddressController);
router.get('/giveConsent/:id',viewsController.giveConsentController);

module.exports = router;