const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/',viewsController.getOverview);
router.get('/sendConsent',viewsController.sendConsentController);
router.get('/giveConsent',viewsController.giveConsentController);
router.get('/confirmConsent',viewsController.confirmConsentController);
module.exports = router;