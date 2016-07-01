module.exports = {
  add: (id, msg) => {
    return new Promise(resolve => {
      const warnings = document.getElementById('warnings'),
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
  remove: id => {
    const warnings = document.getElementById('warnings'),
      warning = document.getElementById('alert-' + id);

    if (warning) {
      console.log(warning);
      warnings.removeChild(warning);
    }
  },
  removeAll: () => {
    document.getElementById('warnings').innerHTML = '';
  }
};
