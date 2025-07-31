const writeLog = require("../utils/logger");

const errorLogger = (err, req, res, next) => {
  const logMsg = `API Error: ${req.method} ${req.originalUrl} - ${err.message}`;
  writeLog(logMsg);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

module.exports = errorLogger;
