'use strict';

const PhunkyWindow = require('./phunky-window');

class PhunkyApp {
  init() {
    PhunkyWindow.create();
  }
}

module.exports = new PhunkyApp();
