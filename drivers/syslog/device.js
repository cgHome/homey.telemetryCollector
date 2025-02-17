/* eslint-disable max-classes-per-file */

'use strict';

// const Homey = require('homey');

/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line node/no-extraneous-require
const { Produce } = require('glossy');

const winston = require('winston');
// eslint-disable-next-line no-unused-expressions
require('winston-syslog').Syslog;

const LogDevice = require('../logDevice');

class SyslogProducer extends Produce {

  produce(data) {
    const message = `${super.produce({ ...data, ...JSON.parse(data.message) })}\n`;
    return message;
  }

}

module.exports = class SyslogAdapter extends LogDevice {

  async onInit() {
    super.onInit();
  }

  async createLogger(settings) {
    super.createLogger(settings);

    const logger = winston.createLogger({
      level: 'debug',
      levels: winston.config.syslog.levels,
      // format: winston.format.errors({ stack: true }), >> Format not working, message = undefined
      transports: [
        // new winston.transports.Console(),
        new winston.transports.Syslog({
          customProducer: SyslogProducer,
          host: this.settings.endpoint,
          port: this.settings.port,
          protocol: this.settings.transport === 'udp' ? 'udp4' : 'tcp4',
          path: '/dev/log',
          facility: this.settings.facility ? this.settings.facility : 'local0',
          localhost: this.homey.app.systemName,
          type: this.settings.useRfc3164 ? 'RFC3164' : 'RFC5424',
          app_name: this.homey.manifest.name.en,
        }),
      ],
    });

    this.logDebug('Logger created');

    return logger;
  }

  sendLog(log) {
    this.logger.log(log.level, {
      severity: log.level,
      facility: log.metadata.facility,
      date: log.timestamp,
      host: this.settings.host ? this.settings.host : this.homey.app.systemName,
      appName: log.metadata.app,
      pid: '-',
      msgID: log.metadata.id.replaceAll('-', ''),
      structuredData: { 'telco@homey': log.metadata },
      message: log.message,
    });
  }

};
