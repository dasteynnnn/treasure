const express = require('express');
const router = express.Router();

//CONTROLLERS
const budgetController = require('../controller/budget');

router.get('/expense/tracker/summary', budgetController.expenseTrackerSummary);
router.post('/expense/tracker/add', budgetController.expenseTrackerAdd);
router.post('/expense/tracker/remove', budgetController.expenseTrackerRemove);
router.post('/expense/tracker/limit/set', budgetController.expenseTrackerLimitSet);
router.get('/expense/tracker/limit/get', budgetController.expenseTrackerLimitGet);

module.exports = router;