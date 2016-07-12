'use strict';

var _tabs = require('./assets/dist/scripts/tabs.js');

var _tabs2 = _interopRequireDefault(_tabs);

var _musixmatch = require('./assets/dist/scripts/musixmatch.js');

var _musixmatch2 = _interopRequireDefault(_musixmatch);

var _youtube = require('./assets/dist/scripts/youtube.js');

var _youtube2 = _interopRequireDefault(_youtube);

var _warn = require('./assets/dist/scripts/warn.js');

var _warn2 = _interopRequireDefault(_warn);

var _setlyrics = require('./assets/dist/scripts/setlyrics.js');

var _setlyrics2 = _interopRequireDefault(_setlyrics);

var _nodeSpotifyWebhelper = require('node-spotify-webhelper');

var _nodeSpotifyWebhelper2 = _interopRequireDefault(_nodeSpotifyWebhelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spotify = new _nodeSpotifyWebhelper2.default.SpotifyWebHelper();

window.onload = function () {
  /**
   * Tabs
   */
  (function () {
    (0, _tabs2.default)();
  })();

  /**
   * Lyrics
   */
  (function () {
    var spotifyData = void 0;

    localStorage.setItem('lIndex', '0');
    localStorage.setItem('has-lyrics', '0');

    /**
     * Returns the song lyrics
     *
     * @return {Array}
     */
    var getLyrics = function getLyrics() {
      var parser = new DOMParser(),
          doc = parser.parseFromString(localStorage.getItem('lyrics'), 'text/xml'),
          verses = doc.querySelectorAll('text');

      return verses;
    };

    /**
     * Sync current song time with lyrics, updating the index of lyrics list
     */
    var setCurrentVerse = function setCurrentVerse() {
      var lyrics = getLyrics(),
          curr = Math.round(parseFloat(localStorage.getItem('curr')) * 100) / 100,
          index = 0;

      for (var k = 0; k < lyrics.length; k++) {
        var el = lyrics[k];

        if (parseFloat(el.attributes.start.value) + parseFloat(el.attributes.dur.value) <= curr) {
          index = k;
        }
      }

      localStorage.setItem('lIndex', '' + index);
    };

    setInterval(function () {
      spotify.getStatus(function (err, res) {
        // Check if there's a communication error with spotifywebhelper
        if (err) {
          _warn2.default.add('communication-error', 'Communication error with Spotify! Restart it!');

          throw err;
        }

        _warn2.default.remove('communication-error');

        localStorage.setItem('curr', '' + res.playing_position);

        // Check if song has changed
        if (spotifyData && spotifyData.track.track_resource.uri === res.track.track_resource.uri) {
          if (localStorage.getItem('has-lyrics') === '1') {
            setCurrentVerse();

            var lyrics = getLyrics(),
                lIndex = parseInt(localStorage.getItem('lIndex'));

            // If is in the start of the song, show 2 verses
            if (lIndex === 0) {
              (0, _setlyrics2.default)(document.createElement('text'), lyrics[lIndex], lyrics[lIndex + 1]);
              document.getElementById(lyrics[lIndex].attributes.start.value.replace('.', 'p')).classList.add('featured-verse');
            } else {
              var allVerses = document.querySelectorAll('.verse'),
                  verseId = lyrics[lIndex + 1].attributes.start.value.replace('.', 'p');

              for (var k = 0; k < allVerses.length; k++) {
                if (allVerses[k].parentNode.parentNode === document.getElementById('lyrics-pos')) {
                  allVerses[k].classList.remove('featured-verse');
                }
              }

              document.getElementById(verseId).classList.add('featured-verse');

              // Adds a verse with 'END' in the end
              var nextText = document.createElement('text');
              nextText.innerHTML = 'END';

              var next = lyrics[lIndex + 2] || nextText;

              (0, _setlyrics2.default)(lyrics[lIndex], lyrics[lIndex + 1], next);
            }
          }
        } else {
          _warn2.default.removeAll();

          document.getElementById('song-name').innerHTML = res.track.track_resource.name;
          document.getElementById('artist-name').innerHTML = res.track.artist_resource.name;
          document.title = '♫ ' + res.track.track_resource.name + ' - ' + res.track.artist_resource.name + ' - phunky';

          // Searches on YouTube for a video regisred on musixmatch
          (0, _youtube2.default)(res.track.artist_resource.name, res.track.track_resource.name).then(function (videos) {
            catchLyrics(0);

            function catchLyrics(video) {
              (0, _musixmatch2.default)(videos[video].id.videoId).then(function (mxmRes) {

                // If there's no lyrics, check for the next
                if (mxmRes.data === '' || mxmRes.data === null) {
                  // but if nothing is found, tell user
                  if (videos.length - 1 === video) {
                    _warn2.default.add('no-lyrics', 'No lyrics found for this song :(').then(function () {
                      document.getElementById('lyrics-container').classList.add('invisible');
                    });

                    localStorage.setItem('has-lyrics', '0');

                    return;
                  }

                  catchLyrics(video + 1);
                }

                _warn2.default.remove('no-lyrics');
                localStorage.setItem('has-lyrics', '1');

                document.getElementById('lyrics-container').style.display = 'block';
                localStorage.setItem('lyrics', mxmRes.data);

                // Change the 'all-verses' section
                document.getElementById('lyrics-pos').innerHTML = '';

                var lyrics = getLyrics();

                for (var _k = 0; _k < lyrics.length; _k++) {
                  var verse = lyrics[_k];

                  var verseDiv = document.createElement('div'),
                      verseSpan = document.createElement('span');

                  verseSpan.setAttribute('id', verse.attributes.start.value.replace('.', 'p'));
                  verseSpan.innerHTML = verse.innerHTML;
                  verseSpan.className = 'verse';

                  verseDiv.appendChild(verseSpan);

                  document.getElementById('lyrics-pos').appendChild(verseDiv);
                }
              });
            }
          });

          setCurrentVerse();
        }

        spotifyData = res;
      });
    }, 500);
  })();
};