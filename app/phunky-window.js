'use strict';

const {BrowserWindow} = require('electron');

class PhunkyWindow {
  create(winOptions) {
    let opts = winOptions || {
      width: 850,
      height: 600,
      center: true,
      alwaysOnTop: true,
      icon: './browser/assets/images/phunky-icon.ico'
    },
      win = new BrowserWindow(opts);

    win.loadURL('file://' + __dirname + '/../browser/index.html');

    win.webContents.on('did-finish-load', function() {
      win.show();
      win.focus();
    });

    win.on('closed', function() {
      win = null;
    });

    return win;
  }
}

module.exports = new PhunkyWindow();
