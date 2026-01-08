const { Worker } = require("bullmq");
const redis = require("../config/redis");
const logger = require("../config/logger");

const notificationWorker = new Worker(
  "notificationQueue",
  async (job) => {
    const { type, userId, branchId, payload } = job.data;

    await redis.publish(
      "ws-events",
      JSON.stringify({
        type,
        userId,
        branchId,
        payload,
      })
    ); 

    return true;
  },
  {
    connection: redis,
    concurrency: 10,
  }
);

notificationWorker.on("completed", (job) => {
  logger.info(`Notification queued for WS: ${job.id}`);
});
