const Redis = require('ioredis');

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "redis://127.0.0.1:6379"
const redisClient = new Redis(redisUrl);

redisClient.on("error", function(err) {
    throw err;
});

module.exports = redisClient