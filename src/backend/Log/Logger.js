const appRoot = require('app-root-path');
var winston = require('winston');
require('winston-daily-rotate-file');
// var time = require('time');

var transport = new (winston.transports.DailyRotateFile)({
  filename: `${appRoot}/Log/logs/application-%DATE%.log`,
  maxsize: 1024,
  datePatten: 'YYYY-MM-DD-HH',
  timestamp: function () {
    return + new Date();
  }
});

var logger = winston.createLogger({
  transports: [
    transport
  ]
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message)
  }
}

module.exports = logger