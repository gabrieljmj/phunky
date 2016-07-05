const lyrics = {
  show: () => {
    document.getElementById('lyrics-container').style.display = 'block';
  },
  hide: () => {
    document.getElementById('lyrics-container').style.display = 'none';
  }
};

module.exports = {
  add: (id, msg) => {
    return new Promise(resolve => {
      if (!document.getElementById('alert-' + id)) {
        const warnings = document.getElementById('warnings'),
          warning = document.createElement('span');

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
  remove: id => {
    const warnings = document.getElementById('warnings'),
      warning = document.getElementById('alert-' + id);

    if (warning) {
      warnings.removeChild(warning);

      if (!warnings.hasChildNodes()) {
        lyrics.show();
      }
    }
  },
  removeAll: () => {
    document.getElementById('warnings').innerHTML = '';
    lyrics.show();
  }
};
