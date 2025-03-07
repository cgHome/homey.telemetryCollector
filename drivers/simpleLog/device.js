'use strict';

// const Homey = require('homey');

const { TELCO_LOGLEVEL } = require('homey-telemetrycollector-api');

const SimpleLogAppApi = require('../../lib/simpleLogAppApi')

const LogDevice = require('../logDevice');

const SEVERITY = Object.freeze({
  [TELCO_LOGLEVEL.EMERGENCY]: 0,
  [TELCO_LOGLEVEL.ALERT]: 1,
  [TELCO_LOGLEVEL.CRITICAL]: 2,
  [TELCO_LOGLEVEL.ERROR]: 3,
  [TELCO_LOGLEVEL.WARNING]: 4,
  [TELCO_LOGLEVEL.NOTICE]: 5,
  [TELCO_LOGLEVEL.INFO]: 6,
  [TELCO_LOGLEVEL.DEBUG]: 7,
})

module.exports = class SimpleLogAdapter extends LogDevice {

  async onInit() {
    super.onInit()
  }

  async isConnected() {
    return true
  }

  async sendLog(log) {
    if (!this.sendToTarget(log)) return

    delete log.metadata.debugMode;

    const data = {
      timestamp: log.timestamp,
      severity: SEVERITY[log.level],
      facility: log.metadata.facility,
      group: log.metadata.app,
      log: log.message,
    };

    // Send log to TelemetryCollectorApp
    await SimpleLogAppApi.getInstance(this.homey)
      .put('addLog', data)
      .catch((error) => this.logError(error))
  }

};
