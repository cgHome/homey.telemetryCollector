'use strict';

module.exports = {
  addLog({ homey, body }) {
    homey.app.addLog(body);
  },
};
