'use strict';

// const Homey = require('homey');

const BaseDevice = require('./device');

const QUEUE_MAX = 100;

module.exports = class LogDevice extends BaseDevice {

  #logQueue = [];

  async onInit() {
    super.onInit();

    this.settings = this.getSettings();
    if (this.settings.autoDeactivateDebugLog && this.settings.debugLogActivated) {
      this.settings.debugLogActivated = false;

      await this.setSettings(this.settings)
        .then(this.logNotice('Debug.Log (automatically) deactivated'))
        .catch((error) => this.logError(error));
    }

    this.homey.app
      .on('sendLog', this.#addToLogQueue.bind(this));

    this.logger = await this.createLogger();
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.logger = await this.createLogger({ ...newSettings }); // Attention: The “newSettings” attributes are read-only
  }

  isConnected() {
    return !!this.logger;
  }

  createLogger(settings) {
    this.settings = settings || this.getSettings();
  }

  sendLog(log) {
    throw Error('Subclass responsibility');
  }

  async #addToLogQueue(log) {
    if (this.#logQueue.length < QUEUE_MAX) {
      await this.#logQueue.push(log);
      await this.#handleQueue();
    }
  }

  #handleQueue() {
    while (this.isConnected() && this.#logQueue.length > 0) {
      this.sendLog(this.#logQueue.shift());
    }
  }

};
