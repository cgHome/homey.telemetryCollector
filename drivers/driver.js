'use strict';

const Homey = require('homey');

module.exports = class BaseDriver extends Homey.Driver {

  async onInit() {
    super.onInit();

    this.ready()
      .then(() => this.logInfo('Driver ready'));
  }

};
