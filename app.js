'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('homey-api');

const { TelemetryCollectorApi } = require('homey-telemetrycollector-api');

// Development
const inspector = require('node:inspector');

if (process.env.DEBUG === '1') {
  try {
    inspector.waitForDebugger();
  } catch (err) {
    inspector.open(9229, '0.0.0.0', true);
  }
}

module.exports = class TelemetryCollectorApp extends TelemetryCollectorApi(Homey.App) {

  async onInit() {
    this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });

    this.systemName = await this.homeyApi.system.getSystemName();

    this.logInfo('App has been initialized');
  }

  addLog(log) {
    this.emit('sendLog', log);
  }

};
