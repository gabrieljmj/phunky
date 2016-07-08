'use strict';

var lyrics = {
  show: function show() {
    document.getElementById('lyrics-container').style.display = 'block';
  },
  hide: function hide() {
    document.getElementById('lyrics-container').style.display = 'none';
  }
};

module.exports = {
  add: function add(id, msg) {
    return new Promise(function (resolve) {
      if (!document.getElementById('warning-' + id)) {
        var warnings = document.getElementById('warnings'),
            warning = document.createElement('div');

        warning.setAttribute('id', 'warning-' + id);
        warning.className = 'warning';
        warning.innerHTML = msg;

        warnings.appendChild(warning);

        warnings.style.display = 'block';

        lyrics.hide();
      }

      resolve();
    });
  },
  remove: function remove(id) {
    var warnings = document.getElementById('warnings'),
        warning = document.getElementById('warning-' + id);

    if (warning) {
      warnings.removeChild(warning);

      if (!warnings.hasChildNodes()) {
        lyrics.show();
      }
    }
  },
  removeAll: function removeAll() {
    document.getElementById('warnings').innerHTML = '';
    lyrics.show();
  }
};