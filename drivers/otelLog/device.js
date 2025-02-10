'use strict';

// const Homey = require('homey');

const logsAPI = require('@opentelemetry/api-logs');
const { LoggerProvider, BatchLogRecordProcessor, ConsoleLogRecordExporter } = require('@opentelemetry/sdk-logs');
const { Resource } = require('@opentelemetry/resources');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');

const winston = require('winston');
const { OpenTelemetryTransportV3 } = require('@opentelemetry/winston-transport');

const LogDevice = require('../logDevice');

module.exports = class OtelLogAdapter extends LogDevice {

  async onInit() {
    super.onInit();

    this.logInfo('Device has been initialized');
  }

  async createLogger(settings) {
    super.createLogger(settings);

    // ipAddress not set
    if (!this.settings.endpoint) return null;

    // process.env.OTEL_SERVICE_NAME = 'telCoApp@homey';
    // process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT = `http://${this.settings.endpoint}:${this.settings.port}/v1/logs`;

    const loggerProvider = new LoggerProvider({
      resource: new Resource({
        'service.name': 'telCoApp@homey',
        'service.version': '1.0.0',
      }),
    });
    loggerProvider.addLogRecordProcessor(
      new BatchLogRecordProcessor(
        new ConsoleLogRecordExporter(),
        new OTLPLogExporter({
          url: `http://${this.settings.endpoint}:${this.settings.port}/v1/logs`,
          headers: {},
        }),
      ),
    );
    logsAPI.logs.setGlobalLoggerProvider(loggerProvider);

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
        new OpenTelemetryTransportV3({
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
      // timestamp: log.timestamp,
      ...log.metadata,
    });
  }

};
