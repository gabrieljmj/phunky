'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _googleapis = require('googleapis');

var _googleapis2 = _interopRequireDefault(_googleapis);

var _config = require('../../../../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client_id = _config2.default.clients.youtube;

// Import with JSON :/


function getYouTubeVideoId(artist, trackName) {
  var youtube = _googleapis2.default.youtube({
    version: 'v3',
    auth: client_id
  });

  var q = artist + ' ' + trackName;
  // Only letters and numbers in search query
  q = q.replace(/[^a-zA-Z0-9 ]/g, '') + ' audio';

  console.info('YouTube - search: ' + q);

  return new Promise(function (resolve, reject) {
    youtube.search.list({
      part: 'id,snippet',
      q: q,
      type: 'video',
      maxResults: 5
    }, function (err, data) {
      if (err) {
        reject(err);
        return;
      }

      console.info('YouTube - found: ' + data.items.length + ' videos');

      resolve(data.items);
    });
  });
};

exports.default = getYouTubeVideoId;