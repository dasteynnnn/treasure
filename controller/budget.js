const redisClient = require('../services/cache');
const util = require('util');

const redisKey = "budgetTracker";

redisClient.hget = util.promisify(redisClient.hget)

exports.expenseTrackerSummary = async (req, res) => {

    const limit = parseInt(await redisClient.hget(redisKey, "limit"))
    const expenses = parseInt(await redisClient.hget(redisKey, "expenses"))
    const overSpend = limit < expenses ? true : false;
    const overSpendAmount = limit - expenses

    const response = {
        "limit" : limit,
        "expenses" : expenses,
        "overSpend" : overSpend,
        "overSpendAmount" : overSpend ? overSpendAmount : 0
    }

    res.send(response)
}

exports.expenseTrackerAdd = async (req, res) => {

    if(!req.body.amount) {
        res.status(500).send({ error : "Invalid Parameters!" })
    }

    let expenses = await redisClient.hget(redisKey, "expenses");
    if(expenses == "NaN" || expenses == null || !expenses){
        expenses = 0
    }
    const newExpenses = parseInt(expenses) + parseInt(req.body.amount);
    redisClient.hset(redisKey, "expenses", newExpenses);

    const response = {
        "message" : "Successfuly added new expense",
        "currentExpenses" : newExpenses
    }
    res.send(response)
}

exports.expenseTrackerRemove = async (req, res) => {

    if(!req.body.amount) {
        res.status(500).send({ error : "Invalid Parameters!" })
    }

    let expenses = parseInt(await redisClient.hget(redisKey, "expenses"))
    if(expenses == "NaN" || expenses == null || !expenses){
        expenses = 0
    }
    let newExpenses = expenses - parseInt(req.body.amount);
    if(newExpenses < 0) newExpenses = 0
    redisClient.hset(redisKey, "expenses", newExpenses);

    const response = {
        "message" : "Successfuly added new expense",
        "oldExpense" : expenses,
        "currentExpenses" : newExpenses
    }
    res.send(response)
}

exports.expenseTrackerLimitSet = async (req, res) => {

    if(!req.body.limit) {
        res.status(500).send({ error : "Invalid Parameters!" })
    }

    redisClient.hset(redisKey, "limit", req.body.limit);
    
    const response = {
        "message": "Successfuly set expense limit",
        "limit": req.body.limit
    }
    res.send(response)
}

exports.expenseTrackerLimitGet = async (req, res) => {

    const limit = await redisClient.hget(redisKey, "limit");

    if(limit == "NaN" || limit == null || !limit){
        limit = 0
    }
    
    const response = {
        "limit": limit
    }
    res.send(response)
}