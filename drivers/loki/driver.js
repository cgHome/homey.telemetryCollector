'use strict';

// const Homey = require('homey');

const BaseDriver = require('../driver');

module.exports = class LokiDriver extends BaseDriver {

  async onInit() {
    super.onInit();
  }

  async onPairListDevices() {
    return [{
      name: 'Grafana-Loki Adapter',
      data: {
        id: 'loki-adapter',
      },
    }];
  }

};
