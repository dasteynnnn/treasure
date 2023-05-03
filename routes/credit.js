const express = require('express');
const router = express.Router();

//CONTROLLERS
const creditController = require('../controller/credit');

router.post('/card/repayment', creditController.cardRepayment)

module.exports = router;