'use strict';

const Homey = require('homey');

const BaseDriver = require('../driver')

module.exports = class LokiAdapterDriver extends BaseDriver {

  async onInit() {
    super.onInit()
    this.logInfo('Driver has been initialized');
  }

  async onPairListDevices() {
    return [{
      name: 'GrafanaLoki Adapter',
      data: {
        id: 'loki-adapter'
      },
    }]
  }

};
