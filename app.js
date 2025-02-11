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

  #actionSend2Log;

  async onInit() {
    this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });

    this.systemName = await this.homeyApi.system.getSystemName();

    this.#actionSend2Log = this.homey.flow.getActionCard('send2log');
    this.#actionSend2Log.registerRunListener((args, state) => this.addLog({
      level: args.level,
      message: args.message,
      metadata: {
        app: args.app ? args.app : '[none]',
        facility: 16,
        facilityName: 'Flow',
      },
    }));

    this.logInfo('App has been initialized');
  }

  addLog(log) {
    this.emit('sendLog', log);
  }

};
