'use strict';

// const Homey = require('homey');

const BaseDevice = require('./device');

const QUEUE_MAX = 100;

module.exports = class LogDevice extends BaseDevice {

  #logQueue = [];

  async onInit() {
    super.onInit();

    this.homey.app.on('sendLog', this.#addToLogQueue.bind(this));

    this.logger = await this.createLogger();
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.logger = await this.createLogger({ ...newSettings }); // Attention: The “newSettings” attributes are read-only
  }

  isConnected() {
    return !!this.logger;
  }

  async createLogger(settings) {
    this.settings = settings || this.getSettings();
  }

  async sendLog(log) {
    throw Error('Subclass responsibility');
  }

  #addToLogQueue(log) {
    if (this.#logQueue.length < QUEUE_MAX) {
      this.#logQueue.push(log);
      this.#handleQueue();
    }
  }

  async #handleQueue() {
    while (this.isConnected() && this.#logQueue.length > 0) {
      this.sendLog(this.#logQueue.shift());
    }
  }

};
