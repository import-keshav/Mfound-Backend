/* node server -- logger file
Name:- logger.js
Created On:- 27/08/18
*/
const winston = require('winston');
  require('winston-daily-rotate-file');
 
  const transport = new (winston.transports.DailyRotateFile)({
    filename: './logs/log-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH'
    //zippedArchive: true,
    //maxSize: '20m',
    //maxFiles: '14d'
  });
 
  transport.on('rotate', function(oldFilename, newFilename) {
    // do something fun
  });
 
  const logger = winston.createLogger({
    transports: [
      transport
    ]
  });


module.exports = logger;
