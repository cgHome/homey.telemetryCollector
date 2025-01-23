'use strict';

const Homey = require('homey');

const BaseDriver = require('../driver')

module.exports = class SyslogAdapterDriver extends BaseDriver {

  async onInit() {
    super.onInit()
    this.logInfo('Driver has been initialized')
  }

  async onPairListDevices(deviceName) {
    return [{
      name: 'Syslog-Adapter',
      data: {
        id: 'syslog-adapter'
      },
    }]
  }

}
