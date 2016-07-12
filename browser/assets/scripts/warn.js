const lyrics = {
  show: () => {
    document.getElementById('lyrics-container').style.display = 'block';
  },
  hide: () => {
    document.getElementById('lyrics-container').style.display = 'none';
  }
};

export default {
  add: (id, msg) => {
    return new Promise(resolve => {
      if (!document.getElementById('warning-' + id)) {
        const warnings = document.getElementById('warnings'),
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
  remove: id => {
    const warnings = document.getElementById('warnings'),
      warning = document.getElementById('warning-' + id);

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
