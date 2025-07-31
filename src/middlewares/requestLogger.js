const writeLog = require("../utils/logger");

const requestLogger = (req, res, next) => {
  if (req.originalUrl.startsWith("/api/")) {
    const { method, originalUrl } = req;
    const ip = req.ip || req.connection.remoteAddress;
    const logMessage = `API Request: ${method} ${originalUrl} from ${ip}`;
    writeLog(logMessage);
  }
  next();
};


module.exports = requestLogger;
