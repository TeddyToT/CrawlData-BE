const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../log");


if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

function writeLog(message) {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const fileName = `log_${day}${month}${year}.log`;

  const filePath = path.join(logDir, fileName);
  const timestamp = now.toLocaleString("vi-VN");
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFile(filePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write log: ", err);
    }
  });
}

module.exports = writeLog;
