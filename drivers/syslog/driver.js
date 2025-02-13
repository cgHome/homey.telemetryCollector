'use strict';

// const Homey = require('homey');

const BaseDriver = require('../driver');

module.exports = class SyslogDriver extends BaseDriver {

  async onInit() {
    super.onInit();
  }

  async onPairListDevices() {
    return [{
      name: 'Syslog Adapter',
      data: {
        id: 'syslog-adapter',
      },
    }];
  }

};
