'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('homey-api');

const crypto = require('node:crypto');

// Development
const inspector = require('node:inspector');

if (process.env.DEBUG === '1') {
  try {
    inspector.waitForDebugger();
  } catch (err) {
    inspector.open(9229, '0.0.0.0', true);
  }
}

// Mixin Pattern
Object.assign(Homey.SimpleClass.prototype, {
  isDebugModeOn() {
    return process.env.DEBUG === '1';
  },
});

// Install the TelemetryCollector-Api
require('homey-telemetrycollector-api').install;

// Prevent endless loop
Homey.SimpleClass.prototype.logError = function (message) {
  this.error(message);
};

module.exports = class TelemetryCollectorApp extends Homey.App {

  #actionSend2Log;

  async onInit() {
    this.notifyInfo('Starting App');

    this.homeyApi = await HomeyAPI.createAppAPI({ homey: this.homey });

    this.systemName = await this.homeyApi.system.getSystemName();

    this.#actionSend2Log = this.homey.flow.getActionCard('send2log');
    this.#actionSend2Log.registerRunListener((args, state) => this.addLog({
      level: args.level,
      message: args.message,
      metadata: {
        id: crypto.randomUUID(),
        app: args.app ? args.app : '-',
        facility: 16,
        facilityName: 'Flow',
      },
    }));

    this.logInfo('App has been initialized');
  }

  addLog(log) {
    this.emit('sendLog', log);
  }

  notifyInfo(msg) {
    return this.homey.notifications.createNotification({
      excerpt: `**${this.homey.manifest.name.en}** - ${msg}`,
    })
      .then(() => this.logInfo(`${msg}`))
      .catch((err) => this.logError(`notifyInfo() > ${err}`));
  }

};
