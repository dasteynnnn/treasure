const redis = require('redis');
const util = require('util');

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "redis://127.0.0.1:6379"
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget)

const helper = require('../helpers/credit')

const redisKey = "cardRepayment";

exports.cardRepayment = async (req, res) => {

    let response = await helper.cardRepayment(req.body);

    client.hset(redisKey, "data", JSON.stringify(response));
    client.hset(redisKey, "bank", req.body[0].bank);
    client.hset(redisKey, "balance", req.body[0].balance);
    client.hset(redisKey, "rate", req.body[0].rate);
    client.hset(redisKey, "mad", req.body[0].mad);
    client.hset(redisKey, "payment", req.body[0].payment);

    res.send({ source : "CACHE", data : response })
}

exports.validateCache = async (req, res) => {

    const cacheData = await client.hget(redisKey, "data");
    const cacheBank = await client.hget(redisKey, "bank");
    const cacheBalance = await client.hget(redisKey, "balance");
    const cacheRate = await client.hget(redisKey, "rate");
    const cacheMad = await client.hget(redisKey, "mad");
    const cachePayment = await client.hget(redisKey, "payment");

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
    client.del(redisKey);
    res.send({ source : "USER-INPUT", cache : false })
}