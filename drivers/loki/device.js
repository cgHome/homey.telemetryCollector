'use strict';

// const Homey = require('homey');

const winston = require('winston');
const LokiTransport = require('winston-loki');

const LogDevice = require('../logDevice');

module.exports = class LokiAdapter extends LogDevice {

  async onInit() {
    super.onInit();
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
          onConnectionError: (err) => this.logError(err),
        }),
      ],
    });

    this.logDebug('createLogger() > Logger created');

    return logger;
  }

  sendLog(log) {
    if (!this.sendToTarget(log)) return

    delete log.metadata.debugMode;

    log.metadata['host'] = this.settings.hostname ? this.settings.hostname : this.homey.app.systemName;

    this.logger.log(log.level, {
      message: log.message,
      labels: log.metadata,
    });
  }

};
