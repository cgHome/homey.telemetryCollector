'use strict';

const Homey = require('homey');

const { TelemetryCollectorApi } = require('homey-telemetrycollector-api');

module.exports = class BaseDevice extends TelemetryCollectorApi(Homey.Device) {

    async onInit() {
        super.onInit();
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
