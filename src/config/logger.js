const fs = require("fs");
const pino = require("pino");
const path = require("path");

const logDir = path.join(__dirname, "..","..", "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = pino(
  {
    level: "info",
  },
  pino.destination({
    dest: path.join(logDir, "app.log"),
    sync: false,
  })
);

module.exports = logger;
