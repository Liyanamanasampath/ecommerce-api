const bullmq = require('bullmq');
const redis = require('../config/redis');

const notificationQueue = new bullmq.Queue('notificationQueue', {
    connection: redis,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    }
})

module.exports = notificationQueue;