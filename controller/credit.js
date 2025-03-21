const redisClient = require('../services/cache');
const helper = require('../helpers/credit');
const util = require('util');

const redisKey = "cardRepayment";

redisClient.hget = util.promisify(redisClient.hget)

exports.cardRepayment = async (req, res) => {

    let response = await helper.cardRepayment(req.body);

    redisClient.hset(redisKey, "data", JSON.stringify(response));
    redisClient.hset(redisKey, "bank", req.body[0].bank);
    redisClient.hset(redisKey, "balance", req.body[0].balance);
    redisClient.hset(redisKey, "rate", req.body[0].rate);
    redisClient.hset(redisKey, "mad", req.body[0].mad);
    redisClient.hset(redisKey, "payment", req.body[0].payment);

    res.send({ source : "CACHE", data : response })
}

exports.validateCache = async (req, res) => {

    const cacheData = await redisClient.hget(redisKey, "data");
    const cacheBank = await redisClient.hget(redisKey, "bank");
    const cacheBalance = await redisClient.hget(redisKey, "balance");
    const cacheRate = await redisClient.hget(redisKey, "rate");
    const cacheMad = await redisClient.hget(redisKey, "mad");
    const cachePayment = await redisClient.hget(redisKey, "payment");

    if(cacheData){
        let cache = {
            data : cacheData,
            bank : cacheBank,
            balance : cacheBalance,
            rate : cacheRate,
            mad : cacheMad,
            payment : cachePayment,
        }
        res.send({ source : "CACHE", cache })
    } else {
        res.send({ source : "USER-INPUT", cache : false })
    }
}

exports.deleteCache = async (req, res) => {
    redisClient.del(redisKey);
    res.send({ source : "USER-INPUT", cache : false })
}

exports.cardRepaymentWaterfall = async (req, res) => {
    
    const payment = req.body.payment
    const balances = req.body.balances
    let response

    balances.sort((a, b) => {
        const aValue = JSON.stringify(Object.values(a).sort());
        const bValue = JSON.stringify(Object.values(b).sort());
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
    });

    balances.forEach(data => {
        data['mad'] = [data.balance * data.madPercentage]
    })

    let initialPayment = 0;

    balances.forEach(data => {
        initialPayment += data.mad[0]
    })

    if(payment < initialPayment){
        response = {
            message: 'Payment amount is insufficient'
        }

        return res.status(400).send(response)
    }

    response = balances
    res.send(response)
}

exports.cardRepaymentMads = async (req, res) => {
    
    const balances = req.body.balances
    let response

    response = {
        total : 0,
        banks : []
    }

    balances.forEach(data => {
        let mad = data.balance * data.madPercentage
        response.total += mad
        response.banks.push({
            name : data.bank,
            mad
        })
    })

    res.send(response)

}

exports.repayment = async (req, res) => {
    
    const banks = req.body.balances.banks
    const loans = req.body.balances.loans
    const bills = req.body.balances.bills

    let response

    response = {
        income : req.body.income,
        total : 0,
        remaining : 0,
        banks : [],
        loans : [],
        bills : []
    }

    banks.forEach(data => {
        let mad = data.balance * data.madPercentage
        response.total += mad
        response.banks.push({
            name : data.bank,
            mad
        })
    })

    loans.forEach(data => {
        response.total += data.amount
        response.loans.push({
            name : data.name,
            amount : data.amount
        })
    })

    bills.forEach(data => {
        response.total += data.amount
        response.bills.push({
            name : data.name,
            amount : data.amount
        })
    })

    response.remaining = response.income - response.total

    res.send(response)

}

exports.snowball = async (req, res) => {
    try {
        const income = req.body.income
        const bills = req.body.bills
        const debts = req.body.debts

        if(debts) {
            let billsAmount = 0
            let debtAmount = 0
            let madAmount = 0
            let interestAmount = 0
            let obligationAmount = 0

            let bankDetails = []

            bills.map(data => {
                billsAmount += data.amount
            })

            debts.map(data => {
                debtAmount += data.amount

                if(data.mad){
                    let interest = data.amount * data.interest
                    let newAmount = data.amount + interest
                    let madTotal = newAmount * data.mad
                    madAmount += madTotal
                    interestAmount += interest

                    bankDetails.push({
                        name : data.name,
                        interest,
                        madAmount : madTotal
                    })
                }

                if(data.obligation){
                    obligationAmount += data.obligation
                }
            })

            res.send({
                status : 200,
                details : {
                    income,
                    billsAmount,
                    debtAmount,
                    interestAmount,
                    madAmount,
                    remaining : income - (billsAmount + madAmount + obligationAmount),
                    bankDetails
                }
            })

        } else {
            res.status(400).send({status: 400, message : `Invalid request`})
        }

    } catch(e) {
        res.status(500).send(e)
    }
}