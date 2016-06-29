module.exports = function warn(msg) {
  return new Promise(resolve => {
    const warning = document.getElementById('warning');

    warning.innerHTML = '<span class="warning">' + msg + '</span>';
    warning.style.display = 'block';

    document.getElementById('lyrics-container').style.distplay = 'none';

    resolve();
  });
};
