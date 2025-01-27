'use strict';

const Homey = require('homey');

const BaseDriver = require('../driver');

const SimpleLogAppApi = require('../../lib/simpleLogAppApi');

module.exports = class SimpleLogAdapterDriver extends BaseDriver {

    async onInit() {
        super.onInit();

        // Init AppApi
        await SimpleLogAppApi.getInstance(this.homey);

        this.logInfo('Driver has been initialized');
    }

    async onPairListDevices(deviceName) {
        return [{
            name: 'SimpleSysLog-Adapter',
            data: {
                id: 'simplesyslog-adapter',
            },
        }];
    }

};
