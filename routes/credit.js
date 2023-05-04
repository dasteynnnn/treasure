const express = require('express');
const router = express.Router();

//CONTROLLERS
const creditController = require('../controller/credit');

router.post('/card/repayment', creditController.cardRepayment)
router.get('/cache/validate', creditController.validateCache)
router.get('/cache/delete', creditController.deleteCache)

module.exports = router;