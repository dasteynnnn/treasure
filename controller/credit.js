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