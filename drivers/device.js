'use strict';

const Homey = require('homey');

module.exports = class BaseDevice extends Homey.Device {

  async onInit() {
    super.onInit();

    this.homey
      .on('unload', this.onUnload.bind(this));

    this.ready()
      .then(() => this.logInfo('Device ready'));
  }

  async onAdded() {
    this.logNotice('Device has been added');
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.logNotice('Device settings where changed');
  }

  async onRenamed(name) {
    this.logNotice('Device was renamed');
  }

  async onDeleted() {
    this.logNotice('Device has been deleted');
  }

  async onUnload() {
    this.logDebug('Device unloaded');
  }

};
