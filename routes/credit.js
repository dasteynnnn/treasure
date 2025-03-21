const express = require('express');
const router = express.Router();

//CONTROLLERS
const creditController = require('../controller/credit');

router.post('/card/repayment', creditController.cardRepayment)
router.get('/cache/validate', creditController.validateCache)
router.get('/cache/delete', creditController.deleteCache)
router.post('/card/repayment/waterfall', creditController.cardRepaymentWaterfall)
router.post('/card/repayment/mads', creditController.cardRepaymentMads)
router.post('/repayment', creditController.repayment)
router.post('/snowball', creditController.snowball)

module.exports = router;