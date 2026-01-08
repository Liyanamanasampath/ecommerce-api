// src/config/socket.js
const { Server } = require("socket.io");
const redis = require("./redis");
const logger = require("./logger");

async function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",")
        : ["http://localhost:3000"],
      credentials: true,
    },
    transports: ["websocket"],
  });

  const subscriber = redis.duplicate();

  subscriber.on("error", (err) => {
    logger.error(err, "Redis WS subscriber error");
  });

  await subscriber.connect();

  await subscriber.subscribe("ws-events", (message) => {
    try {
      const { type, userId, branchId, payload } = JSON.parse(message);

      logger.info(
        { type, userId, branchId },
        " WS event received from Redis"
      );

      if (branchId) {
        io.to(`branch:${branchId}`).emit("notification", {
          type,
          payload,
        });
      }

      if (userId) {
        io.to(`user:${userId}`).emit("notification", {
          type,
          payload,
        });
      }
    } catch (err) {
      logger.error(err, "Failed to process WS Redis message");
    }
  });
  return io;
}

module.exports = { initSocket };
