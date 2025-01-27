'use strict';

// const Homey = require('homey');

const winston = require('winston');
// const LokiTransport = require('winston-loki');

const LogDevice = require('../logDevice');

module.exports = class LokiAdapterDevice extends LogDevice {

  async onInit() {
    super.onInit();

    this.logInfo('Device has been initialized');
  }

  async createLogger(settings) {
    super.createLogger(settings);

    const logger = winston.createLogger({
      level: 'debug',
      levels: winston.config.syslog.levels,
      // format: format.errors({ stack: true }),
      transports: [
        new winston.transports.Console(),
        new winston.LokiTransport({
          host: `${this.settings.endpoint}:${this.settings.port}`,
          format: format.json(),
          replaceTimestamp: true,
          onConnectionError: (err) => this.error(err),
        }),
      ],
    });

    this.logDebug('createLogger() > Logger created');

    return logger;
  }

  sendLog(log) {
    const data = {
      level: log.level,
      message: log.message,
      labels: {
      },
    };

    // this.log(`#sendLog() data: ${JSON.stringify(data)}`)

    this.logger.log(data);
  }

};
