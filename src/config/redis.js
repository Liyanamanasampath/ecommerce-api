const ioredis = require('ioredis');

const redis = new ioredis({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    password : process.env.REDIS_PASSWORD,
})

redis.on('connect',()=>{
    console.log('Redis connected successfully');
})

redis.on('error',()=>{
    console.error('Redis connection error');
})

module.exports = redis;