'use strict';

var axios = require('axios'),
    API_URL = 'http://extension.musixmatch.com';

function _buildUrlForRequest(videoId) {
  return API_URL + '/?res=' + _encodeVideoId(videoId);
}

/**
 * I don't know certanly what this does
 */
function _encodeVideoId(videoId) {
  var f = function f(e) {
    var r = '',
        n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        t = 0;

    while (t < e) {
      r += n.charAt(Math.floor(Math.random() * n.length)), t++;

      return r;
    }
  },
      l = function l(e) {
    var i = '',
        n = 0;

    while (n < e.length) {
      var t = e.charCodeAt(n) + 13,
          r = Math.floor(Math.random() * 3 + 1);

      i += t + f(r), n++;
    }

    return i;
  };

  return l(videoId);
};

module.exports = function getLyrics(videoId) {
  return axios.get(_buildUrlForRequest(videoId));
};