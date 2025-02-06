/* eslint-disable max-classes-per-file */

'use strict';

// const Homey = require('homey');

/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line node/no-extraneous-require
const { Produce } = require('glossy');

const winston = require('winston');
require('winston-syslog');

const LogDevice = require('../logDevice');

class SyslogProducer extends Produce {

  produce(data) {
    const msgData = JSON.parse(data.message);
    msgData.date = new Date(msgData.date);
    const message = super.produce({ ...data, ...msgData });
    return message;
  }

}

module.exports = class SyslogAdapter extends LogDevice {

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
      // format: format.errors({ stack: true }),
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
    const data = {
      level: log.level,
      severity: log.level,
      facility: log.metadata.facility,
      date: log.ts,
      host: this.homey.app.systemName,
      appName: log.metadata.application,
      pid: '-',
      msgID: log.metadata.id.replaceAll('-', ''),
      structuredData: { 'telCoLog@homey': log.metadata },
      message: log.message,
    };

    // this.log(`#sendLog() data: ${JSON.stringify(data)}`)

    this.logger.log(data);
  }

};
