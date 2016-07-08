const googleapi = require('googleapis'),
  client_id = require('../../../../config.json').clients.youtube;

module.exports = function getYouTubeVideoId(artist, trackName) {
  const youtube = googleapi.youtube({
    version: 'v3',
    auth: client_id
  });

  let q = artist + ' ' + trackName;
  // Only letters and numbers in search query
  q = q.replace(/[^a-zA-Z0-9 ]/g, '') + ' audio';

  console.info('YouTube - search: ' + q);

  return new Promise((resolve, reject) => {
    youtube.search.list({
      part: 'id,snippet',
      q,
      type: 'video',
      maxResults: 5
    }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      console.info('YouTube - found: ' + data.items.length + ' videos');

      resolve(data.items);
    });
  });
};
