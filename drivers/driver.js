'use strict';

const Homey = require('homey');

const { TelemetryCollectorApi } = require('homey-telemetrycollector-api');

module.exports = class BaseDriver extends TelemetryCollectorApi(Homey.Driver) {

    async onInit() {
        super.onInit();
    }

};
