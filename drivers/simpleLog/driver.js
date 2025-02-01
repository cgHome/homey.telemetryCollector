'use strict';

// const Homey = require('homey');

const BaseDriver = require('../driver');

const SimpleLogAppApi = require('../../lib/simpleLogAppApi');

module.exports = class SimpleLogDriver extends BaseDriver {

  async onInit() {
    super.onInit();

    // Init AppApi
    await SimpleLogAppApi.getInstance(this.homey);

    this.logInfo('Driver has been initialized');
  }

  async onPairListDevices() {
    return [{
      name: 'SimpleSysLog Adapter',
      data: {
        id: 'simpleSysLog-adapter',
      },
    }];
  }

};
