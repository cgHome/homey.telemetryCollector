'use strict';

const Homey = require('homey');

module.exports = class BaseDevice extends Homey.Device {

  async onInit() {
    super.onInit();

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

};
