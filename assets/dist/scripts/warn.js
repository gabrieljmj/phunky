'use strict';

module.exports = {
  add: function add(id, msg) {
    return new Promise(function (resolve) {
      var warnings = document.getElementById('warnings'),
          warning = document.createElement('span');

      warning.setAttribute('id', 'warning-' + id);
      warning.className = 'warning';
      warning.innerHTML = msg;

      warnings.appendChild(warning);

      warnings.style.display = 'block';

      document.getElementById('lyrics-container').style.distplay = 'none';

      resolve();
    });
  },
  remove: function remove(id) {
    var warnings = document.getElementById('warnings'),
        warning = document.getElementById('alert-' + id);

    if (warning) {
      warnings.removeChild(warning);
    }
  },
  removeAll: function removeAll() {
    document.getElementById('warnings').innerHTML = '';
  }
};