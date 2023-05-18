const express = require('express');
const router = express.Router();

//CONTROLLERS
const romanController = require('../controller/roman');

router.get('/convert/:number', romanController.convert)

module.exports = router;