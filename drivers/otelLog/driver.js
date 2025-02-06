'use strict';

// const Homey = require('homey');

const BaseDriver = require('../driver');

module.exports = class OtelLogDriver extends BaseDriver {

  async onInit() {
    super.onInit();

    this.logInfo('Driver has been initialized');
  }

  async onPairListDevices() {
    return [{
      name: 'OTel-Log Adapter',
      data: {
        id: 'otellog-adapter',
      },
    }];
  }

};
