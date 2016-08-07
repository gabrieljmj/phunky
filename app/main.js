'use strict';

const {app} = require('electron'),
  PhunkyApp = require('./phunky-app');

const ready = function() {
  PhunkyApp.init();
},

  windowAllClosed = function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  };

app.on('ready', ready);

app.on('window-all-closed', windowAllClosed);
