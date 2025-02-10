'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('homey-api');

// Install the TelemetryCollector Api
// eslint-disable-next-line no-unused-expressions
require('homey-telemetrycollector-api').install;

// Development
const inspector = require('node:inspector');

if (process.env.DEBUG === '1') {
  try {
    inspector.waitForDebugger();
  } catch (err) {
    inspector.open(9229, '0.0.0.0', true);
  }
}

module.exports = class TelemetryCollectorApp extends Homey.App {

  async onInit() {
    this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });

    this.systemName = await this.homeyApi.system.getSystemName();

    this.logInfo('App has been initialized');
  }

  addLog(log) {
    this.emit('sendLog', log);
  }

};
