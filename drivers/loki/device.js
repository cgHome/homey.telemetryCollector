'use strict';

// const Homey = require('homey');

const winston = require('winston');
const LokiTransport = require('winston-loki');

const LogDevice = require('../logDevice');

module.exports = class LokiAdapter extends LogDevice {

  async onInit() {
    super.onInit();

    this.logInfo('Device has been initialized');
  }

  async createLogger(settings) {
    super.createLogger(settings);

    // ipAddress not set
    if (!this.settings.endpoint) return null;

    const logger = winston.createLogger({
      level: 'debug',
      levels: winston.config.syslog.levels,
      defaultMeta: { service: 'telco@homey' },
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
      ),
      transports: [
        // new winston.transports.Console(),
        new LokiTransport({
          host: `http://${this.settings.endpoint}:${this.settings.port}`,
          json: true,
          onConnectionError: (err) => this.error(err),
        }),
      ],
    });

    this.logDebug('createLogger() > Logger created');

    return logger;
  }

  sendLog(log) {
    this.logger.log({
      level: log.level,
      message: log.message,
      labels: log.metadata,
    });
  }

};
