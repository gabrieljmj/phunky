const app = require('app'),
  BrowserWindow = require('browser-window');

const start = function() {
  const winOptions = {
    width: 850,
    height: 600,
    center: true,
    icon: './assets/images/phunky-icon.ico'
  },
    win = new BrowserWindow(winOptions);

  win.loadUrl('file://' + __dirname + '/index.html');

  win.webContents.on('did-finish-load', function() {
    win.show();
    win.focus();
  });

  win.on('closed', function() {
    win = null;
  });
};

app.on('ready', start);
